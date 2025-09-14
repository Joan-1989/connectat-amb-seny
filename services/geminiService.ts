// services/geminiService.ts — client cap al proxy /api/gemini
import type {
  ChatMessage,
  QuizQuestion,
  RoleplayState,
  RoleplayStep,
  JournalFeedback
} from '../types';

const PROXY_URL = '/api/gemini';

// utilitat per fer POST al proxy
async function postGemini(payload: unknown): Promise<any> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('Gemini proxy error:', data);
    throw new Error(`Gemini HTTP ${res.status}`);
  }
  return data;
}

// extreu text del response de Gemini API v1beta
function textFromResponse(apiResponse: any): string {
  try {
    return apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  } catch {
    return '';
  }
}

/** CHAT GENERAL */
export async function generateChatResponse(
  history: ChatMessage[],
  newMessage: string,
  systemInstruction: string
): Promise<string> {
  const sys = systemInstruction
    ? { role: 'system', parts: [{ text: systemInstruction }] }
    : undefined;

  const contents = [
    ...(sys ? [sys] : []),
    ...history.map(m => ({ role: m.role, parts: m.parts })),
    { role: 'user', parts: [{ text: newMessage }] }
  ];

  const generationConfig = {
    temperature: 0.4,
    maxOutputTokens: 512
  };

  const resp = await postGemini({ contents, generationConfig });
  return textFromResponse(resp) || "Uups! Sembla que he tingut un problema per respondre. Prova-ho de nou.";
}

/** QÜESTIONARI */
export async function generateQuiz(topic: string): Promise<QuizQuestion[]> {
  const sys = { role: 'system', parts: [{ text: 'Respon sempre en català i en format JSON vàlid.' }] };
  const contents = [
    sys,
    { role: 'user', parts: [{ text: `Genera un qüestionari de 5 preguntes de selecció múltiple sobre "${topic}" per a adolescents. Format JSON: [{"pregunta": "...", "opcions": ["A","B","C","D"], "resposta_correcta": "A"}]` }] }
  ];
  const generationConfig = {
    temperature: 0.5,
    maxOutputTokens: 800
  };
  const resp = await postGemini({ contents, generationConfig });
  const txt = textFromResponse(resp);
  try {
    const parsed = JSON.parse(txt);
    if (Array.isArray(parsed)) return parsed as QuizQuestion[];
  } catch {
    /* ignore */
  }
  return [];
}

/** PLA DE BENESTAR (diari / autoavaluació) */
export async function generateWellbeingPlan(answers: string[]): Promise<{ consells: string[]; reptes: string[] }> {
  const sys = { role: 'system', parts: [{ text: 'Respon sempre en català i en JSON vàlid.' }] };
  const contents = [
    sys,
    { role: 'user', parts: [{ text: `Amb aquestes respostes d'autoavaluació (${answers.join(', ')}), crea un pla amb 3 consells i 3 reptes setmanals. Dona'm JSON: {"consells":["..."],"reptes":["..."]}` }] }
  ];
  const generationConfig = { temperature: 0.4, maxOutputTokens: 500 };
  const resp = await postGemini({ contents, generationConfig });
  const txt = textFromResponse(resp);
  try {
    const parsed = JSON.parse(txt);
    if (parsed?.consells && parsed?.reptes) return parsed;
  } catch { /* ignore */ }
  return { consells: [], reptes: [] };
}

/** INICIADORS DE CONVERSA (per a adults) */
export async function generateConversationStarters(topic: string): Promise<string[]> {
  const sys = { role: 'system', parts: [{ text: 'Respon en català i en JSON pur (array de strings).' }] };
  const contents = [
    sys,
    { role: 'user', parts: [{ text: `Genera 5 iniciadors de conversa per parlar amb adolescents sobre "${topic}".` }] }
  ];
  const generationConfig = { temperature: 0.5, maxOutputTokens: 400 };
  const resp = await postGemini({ contents, generationConfig });
  const txt = textFromResponse(resp);
  try {
    const arr = JSON.parse(txt);
    if (Array.isArray(arr)) return arr as string[];
  } catch { /* ignore */ }
  return [];
}

/** DILEMES SOCIALS — retorna { pros, cons, assertiveResponse } */
export async function analyzeDilemmaChoice(
  prompt: string,
  choice: string
): Promise<{ pros: string[]; cons: string[]; assertiveResponse: string }> {
  const contents = [
    { role: 'system', parts: [{ text: 'Ets un mentor empàtic. Respon en català i DONA JSON amb claus "pros", "cons", "assertiveResponse".' }] },
    { role: 'user', parts: [{ text: `Dilema: ${prompt}\nElecció triada: ${choice}\nDona'm JSON: {"pros":["..."],"cons":["..."],"assertiveResponse":"..."} (res sense comentaris).` }] }
  ];
  const generationConfig = { temperature: 0.4, maxOutputTokens: 300 };
  const resp = await postGemini({ contents, generationConfig });
  const txt = textFromResponse(resp);

  // Intenta JSON directe
  try {
    const parsed = JSON.parse(txt);
    if (parsed && Array.isArray(parsed.pros) && Array.isArray(parsed.cons) && typeof parsed.assertiveResponse === 'string') {
      return parsed;
    }
  } catch { /* parse fallback */ }

  // Fallback heurístic si arriba text lliure
  const pros: string[] = [];
  const cons: string[] = [];
  let assertiveResponse = '';
  (txt || '').split('\n').forEach(l => {
    const s = l.trim();
    if (/^(\+|pros?:)/i.test(s)) pros.push(s.replace(/^(\+|pros?:)\s*/i, ''));
    else if (/^(-|contres?:|cons?:)/i.test(s)) cons.push(s.replace(/^(-|contres?:|cons?:)\s*/i, ''));
    else if (/^(resposta|assertiu|assertive)/i.test(s)) assertiveResponse = s.replace(/^[^:]*:\s*/i, '');
  });
  return {
    pros: pros.length ? pros : [txt || ''],
    cons,
    assertiveResponse: assertiveResponse || 'Prova a expressar el teu límit amb respecte i claredat, oferint una alternativa viable.'
  };
}

/** ROLEPLAY RAMIFICAT (un pas) */
export async function generateRoleplayStep(state: RoleplayState, lastChoice?: string): Promise<RoleplayStep> {
  const preface = `Tema: ${state.topic}. Estil: natural, adolescent, en català. Dona 2-3 opcions curtes d'acció.`;

  const contents = [
    { role: 'system', parts: [{ text: preface }] },
    ...state.context.map(m => ({ role: m.role, parts: m.parts })),
    { role: 'user', parts: [{ text: lastChoice ? `Continuem. L'usuari ha triat: "${lastChoice}". Respon amb una frase (NPC) i noves opcions.` : 'Comencem el roleplay. Proposa un inici i 2-3 opcions.' }] }
  ];
  const generationConfig = { temperature: 0.6, maxOutputTokens: 350 };
  const resp = await postGemini({ contents, generationConfig });
  const text = textFromResponse(resp);

  // Heurística per extreure opcions
  const lines = (text || '').split('\n').map(s => s.trim()).filter(Boolean);
  const npcSay = lines[0] || text || '';
  const optionLines = lines.slice(1).filter(l => /^[-•]/.test(l)).slice(0, 3);
  const options = (optionLines.length ? optionLines : ['Opció A', 'Opció B'].map((l, i) => `-${l}`))
    .map((l, idx) => ({
      id: `opt_${Date.now()}_${idx}`,
      label: l.replace(/^[-•]\s?/, '')
    }));

  return { npcSay, options };
}

/** DIARI: analitza una entrada i retorna JournalFeedback */
export async function analyzeJournalEntry(entryText: string): Promise<JournalFeedback> {
  const contents = [
    { role: 'system', parts: [{ text: 'Ets un orientador empàtic. Respon en català. Dona JSON {"strengths":["..."],"suggestions":["..."],"summary":"..."}' }] },
    { role: 'user', parts: [{ text: `Analitza aquest text de diari i retorna JSON: ${entryText}` }] }
  ];
  const generationConfig = { temperature: 0.4, maxOutputTokens: 300 };
  const resp = await postGemini({ contents, generationConfig });
  const txt = textFromResponse(resp);
  try {
    const parsed = JSON.parse(txt);
    if (parsed?.strengths && parsed?.suggestions && typeof parsed?.summary === 'string') {
      return parsed as JournalFeedback;
    }
  } catch { /* ignore */ }
  return { strengths: [], suggestions: [], summary: 'Gràcies per compartir. Continua reflexionant amb sinceritat.' };
}
