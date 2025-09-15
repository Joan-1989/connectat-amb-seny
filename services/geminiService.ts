// services/geminiService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Client únic per parlar amb el proxy de Gemini (/api/gemini) amb el format
// { contents: [...] } i, opcionalment, { systemInstruction, generationConfig }.
// IMPORTANT: sense "additionalProperties" als responseSchema (causava 400).
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChatMessage,
  RoleplayState,
  RoleplayStep,
  JournalFeedback,
} from '../types';

const GEMINI_ENDPOINT = '/api/gemini';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

type BareMessage = { role: 'user' | 'model'; parts: { text: string }[] };

function cleanHistory(history: ChatMessage[]): BareMessage[] {
  const cleaned = history
    .filter((m) => m && (m.role === 'user' || m.role === 'model'))
    .map((m) => ({
      role: m.role,
      parts: [{ text: String(m.parts?.[0]?.text ?? '') }],
    }));
  // El 1r element HA de ser 'user'. Si no, elminem el prefix fins trobar-ne un.
  while (cleaned.length && cleaned[0].role !== 'user') {
    cleaned.shift();
  }
  return cleaned;
}

function toUserContent(text: string): BareMessage {
  return { role: 'user', parts: [{ text }] };
}

function toSystemInstruction(text?: string) {
  if (!text) return undefined;
  return { role: 'system', parts: [{ text }] };
}

function stripCodeFences(s: string): string {
  if (!s) return s;
  return s.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();
}

function tryParseJSON<T = unknown>(maybe: string | unknown): T | null {
  if (typeof maybe !== 'string') return null;
  const txt = stripCodeFences(maybe);
  try {
    return JSON.parse(txt) as T;
  } catch {
    return null;
  }
}

function extractText(out: unknown): string {
  if (typeof out === 'string') return out.trim();
  if (out && typeof out === 'object') {
    const anyOut = out as any;
    if (typeof anyOut.text === 'string') return anyOut.text.trim();
    const parts = anyOut?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      const joined = parts.map((p: any) => p?.text ?? '').join('').trim();
      if (joined) return joined;
    }
  }
  return '';
}

async function callGemini<T = unknown>(payload: unknown): Promise<T> {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    console.error('Gemini proxy error:', typeof body === 'string' ? body : JSON.stringify(body));
    throw new Error(`Gemini HTTP ${res.status}`);
  }

  return body as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1) XAT GENERAL
// ─────────────────────────────────────────────────────────────────────────────

export async function generateChatResponse(
  history: ChatMessage[],
  newMessage: string,
  systemInstruction: string
): Promise<string> {
  const contents = [...cleanHistory(history), toUserContent(newMessage)];

  const payload = {
    // model: 'gemini-1.5-flash', // opcional si el proxy ho permet
    contents,
    systemInstruction: toSystemInstruction(systemInstruction),
  };

  const out = await callGemini<unknown>(payload);
  const text = extractText(out);
  return text || 'Ho sento, no he entès la consulta.';
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) DIARI DE REFLEXIÓ -> JSON (fortaleses, suggeriments, resum)
// ─────────────────────────────────────────────────────────────────────────────

export async function analyzeJournalEntry(text: string): Promise<JournalFeedback> {
  const prompt = `
Analitza aquest escrit d'un/a adolescent i retorna JSON amb:
- "strengths": 3 punts positius (frases curtes)
- "suggestions": 3 idees pràctiques, amables i concretes
- "summary": 1-2 frases en català, validades i empàtiques

Text:
"""${text}"""
  `.trim();

  const payload = {
    contents: [toUserContent(prompt)],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          strengths: { type: 'array', items: { type: 'string' } },
          suggestions: { type: 'array', items: { type: 'string' } },
          summary: { type: 'string' },
        },
        required: ['strengths', 'suggestions', 'summary'],
      },
    },
  };

  const out = await callGemini<unknown>(payload);
  const raw = extractText(out);
  const parsed = tryParseJSON<JournalFeedback>(raw);

  if (parsed && Array.isArray(parsed.strengths) && Array.isArray(parsed.suggestions) && typeof parsed.summary === 'string') {
    return parsed;
  }

  return {
    strengths: ['T’has expressat amb sinceritat.', 'Mostres autoconeixement.', 'Vols millorar.'],
    suggestions: ['Respira 3 cops profunds quan notis tensió.', 'Escriu 1 objectiu petit per demà.', 'Parla amb algú de confiança 10 minuts.'],
    summary: 'Estàs fent una bona reflexió. Amb petits passos i suport, avançaràs.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) DILEMES SOCIALS -> JSON (pros/cons/resposta assertiva)
// ─────────────────────────────────────────────────────────────────────────────

export async function analyzeDilemmaChoice(
  dilemmaPrompt: string,
  chosenOptionLabel: string
): Promise<{ pros: string[]; cons: string[]; assertiveResponse: string }> {
  const prompt = `
Analitza aquest dilema i la decisió triada. Retorna JSON amb:
- "pros": 3 avantatges de l'opció triada
- "cons": 3 possibles inconvenients/riscs
- "assertiveResponse": una resposta assertiva (1-2 frases) per comunicar-la

Dilema:
"""${dilemmaPrompt}"""

Opció triada:
"""${chosenOptionLabel}"""
  `.trim();

  const payload = {
    contents: [toUserContent(prompt)],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          pros: { type: 'array', items: { type: 'string' } },
          cons: { type: 'array', items: { type: 'string' } },
          assertiveResponse: { type: 'string' },
        },
        required: ['pros', 'cons', 'assertiveResponse'],
      },
    },
  };

  const out = await callGemini<unknown>(payload);
  const raw = extractText(out);
  const parsed = tryParseJSON<{ pros: string[]; cons: string[]; assertiveResponse: string }>(raw);

  if (parsed && Array.isArray(parsed.pros) && Array.isArray(parsed.cons) && typeof parsed.assertiveResponse === 'string') {
    return parsed;
  }

  return {
    pros: ['Et mantens fidel als teus valors.', 'Protegeixes els teus límits.', 'Dones exemple d’assertivitat.'],
    cons: ['Algú pot molestar-se.', 'Potser caldrà negociar opcions.', 'No tothom ho entendrà al moment.'],
    assertiveResponse: 'Prefereixo no fer-ho aquesta vegada. Gràcies per pensar en mi; podem buscar una alternativa que ens encaixi a tots.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) ROLEPLAY RAMIFICAT (cada pas amb 3 opcions)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateRoleplayStep(
  state: RoleplayState,
  _userChoiceLabel?: string
): Promise<RoleplayStep> {
  const historyText = cleanHistory(state.context)
    .map((m) => `${m.role === 'user' ? 'Usuari' : 'NPC'}: ${m.parts[0].text}`)
    .join('\n');

  const prompt = `
Estem fent un roleplay breu sobre: "${state.topic}".
Context fins ara:
${historyText || '(cap missatge encara)'}

Si hi ha "Usuari tria: X", continua de forma coherent.

Retorna JSON amb:
{
  "npcSay": "parla natural en català (1-3 frases)",
  "options": ["opció A breu", "opció B breu", "opció C breu"]
}
  `.trim();

  const payload = {
    contents: [toUserContent(prompt)],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          npcSay: { type: 'string' },
          options: {
            type: 'array',
            items: { type: 'string' },
            minItems: 3,
            maxItems: 3,
          },
        },
        required: ['npcSay', 'options'],
      },
    },
  };

  const out = await callGemini<unknown>(payload);
  const raw = extractText(out);
  const parsed = tryParseJSON<{ npcSay: string; options: string[] }>(raw);

  const safeNpc = parsed?.npcSay?.trim() || 'Ei, com ho veus?';
  const safeOpts = Array.isArray(parsed?.options) && parsed!.options.length >= 3
    ? parsed!.options.slice(0, 3)
    : ['Dir que no amb respecte', 'Proposar alternativa', 'Demanar més info'];

  return {
    npcSay: safeNpc,
    options: safeOpts.map((label, i) => ({ id: `opt-${i + 1}`, label })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5) CONVERSES (famílies/pros) – 5 preguntes obertes
// ─────────────────────────────────────────────────────────────────────────────

export async function generateConversationStarters(topic: string): Promise<string[]> {
  const prompt = `
Crea 5 iniciadors de conversa en català (preguntes obertes, no jutjadores) per parlar amb adolescents sobre "${topic}".
Només retorna un array JSON de 5 cadenes.
  `.trim();

  const payload = {
    contents: [toUserContent(prompt)],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: { type: 'string' },
        minItems: 5,
        maxItems: 5,
      },
    },
  };

  const out = await callGemini<unknown>(payload);
  const raw = extractText(out);
  const parsed = tryParseJSON<string[]>(raw);
  if (Array.isArray(parsed) && parsed.length >= 3) return parsed.slice(0, 5);

  return [
    'Com et fa sentir això últim que ha passat al mòbil?',
    'Què creus que t’ajudaria a tenir més calma amb les pantalles?',
    'Quan t’has sentit orgullós/a de com ho vas gestionar?',
    'Què t’agradaria que jo entengués millor del que vius en línia?',
    'Quina seria una petita acció que podríem provar aquesta setmana?',
  ];
}
