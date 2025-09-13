// services/geminiService.ts
import {
  GoogleGenerativeAI,
  GenerationConfig,
  SchemaType,
  type Schema
} from "@google/generative-ai";
import type {
  QuizQuestion,
  ChatMessage,
  RoleplayState,
  RoleplayStep,
  JournalFeedback
} from "./../types";

// ---- API KEY (.env) ----
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY no està definida. Revisa el teu .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ---- Utils ----
async function runWithRetry<T>(apiCall: () => Promise<T>, retries = 3, initialDelay = 800): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await apiCall();
    } catch (error: any) {
      if ((error?.status === 503 || error?.status === 429) && attempt < retries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
        attempt++;
      } else {
        throw error;
      }
    }
  }
  throw new Error("La crida a l'API ha fallat després de varis intents.");
}

// El model NO accepta camps extra. Deixem només role + parts i només 'user'|'model'.
function cleanHistory(history: ChatMessage[]) {
  return history
    .filter(m => m.role === "user" || m.role === "model")
    .map(({ role, parts }) => ({ role, parts }));
}

/* =================== SCHEMAS =================== */

// Quiz: array d'objectes {pregunta, opcions[], resposta_correcta}
const quizSchema: Schema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      pregunta: { type: SchemaType.STRING },
      opcions: {
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      resposta_correcta: { type: SchemaType.STRING }
    },
    required: ["pregunta", "opcions", "resposta_correcta"]
  }
};

// Wellbeing plan: {consells: string[], reptes: string[]}
const wellbeingSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    consells: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    reptes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
  },
  required: ["consells", "reptes"]
};

// Conversation starters: string[]
const startersSchema: Schema = {
  type: SchemaType.ARRAY,
  items: { type: SchemaType.STRING }
};

// Roleplay step: { npcSay: string, options: {id,label}[] }
const roleplayStepSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    npcSay: { type: SchemaType.STRING },
    options: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          label: { type: SchemaType.STRING }
        },
        required: ["id", "label"]
      }
    }
  },
  required: ["npcSay", "options"]
};

// Journal feedback: { strengths: string[], suggestions: string[], summary: string }
const journalSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    summary: { type: SchemaType.STRING }
  },
  required: ["strengths", "suggestions", "summary"]
};

/* =================== QUIZ =================== */
export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: quizSchema
  };

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: `Genera un qüestionari de 5 preguntes de selecció múltiple en català sobre "${topic}" per a adolescents. Cada pregunta ha de tenir 4 opcions.` }]
        }],
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error generating quiz:", e);
    return [];
  }
};

/* =================== WELLBEING PLAN =================== */
export const generateWellbeingPlan = async (answers: string[]): Promise<{ consells: string[]; reptes: string[] }> => {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: wellbeingSchema
  };

  const prompt = `Respostes d'autoavaluació: ${answers.join(', ')}.
Genera en català 3 consells i 3 reptes setmanals de benestar digital per a un/a adolescent.`;

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error generating wellbeing plan:", e);
    return { consells: [], reptes: [] };
  }
};

/* =================== CHAT RESPONSE =================== */
export const generateChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const cleaned = cleanHistory(history);
    const chat = model.startChat({
      history: cleaned,
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
    });
    const result = await runWithRetry(async () => chat.sendMessage(newMessage));
    return result.response.text();
  } catch (e) {
    console.error("Error generating chat response:", e);
    return "Uups! Sembla que he tingut un problema per respondre. Prova-ho de nou.";
  }
};

/* =================== CONVERSATION STARTERS =================== */
export const generateConversationStarters = async (topic: string): Promise<string[]> => {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: startersSchema
  };

  const prompt = `Genera 5 iniciadors de conversa en català per a pares/educadors per parlar amb adolescents sobre "${topic}".
Han de ser preguntes obertes, respectuoses i no judicatives. Escriu només l'array JSON de 5 cadenes.`;

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error generating conversation starters:", e);
    return [];
  }
};

/* =================== ROLEPLAY (STEP) =================== */
export const generateRoleplayStep = async (
  state: RoleplayState,
  userChoiceLabel?: string
): Promise<RoleplayStep> => {
  const systemInstruction = `Ets un NPC en un roleplay educatiu per adolescents sobre habilitats socials i gestió emocional.
Respon sempre en català, amb 1-3 frases clares i empàtiques. A cada pas, proposa 2-3 opcions d'acció diferents i realistes.`;

  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: roleplayStepSchema
  };

  const cleaned = cleanHistory(state.context);

  const userPrompt = userChoiceLabel
    ? `Tema: ${state.topic}.
L'usuari ha triat: "${userChoiceLabel}".
Continua com a NPC amb una resposta coherent i ofereix 2-3 opcions noves.`
    : `Tema: ${state.topic}.
Inicia el roleplay com a NPC amb una situació plausible i ofereix 2-3 opcions.`;

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [
          ...cleaned,
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error generateRoleplayStep:", e);
    return { npcSay: "Ho sento, no puc continuar el roleplay ara mateix.", options: [] };
  }
};

/* =================== DILEMMAS (pros/cons + assertive) =================== */
export const analyzeDilemmaChoice = async (
  dilemmaPrompt: string,
  choiceLabel: string
): Promise<{ pros: string[]; cons: string[]; assertiveResponse: string }> => {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        pros: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        cons: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        assertiveResponse: { type: SchemaType.STRING }
      },
      required: ["pros", "cons", "assertiveResponse"]
    }
  };

  const prompt = `Dilema: ${dilemmaPrompt}
Opció triada per l'usuari: "${choiceLabel}"

En català:
- Dona 2-3 pros
- Dona 2-3 contres
- Proposa una resposta assertiva (1-2 frases) que marqui el límit i cuidi la relació.`;

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error analyzeDilemmaChoice:", e);
    return { pros: [], cons: [], assertiveResponse: "Ho sento, no he pogut analitzar-ho ara mateix." };
  }
};

/* =================== JOURNAL FEEDBACK =================== */
export const analyzeJournalEntry = async (text: string): Promise<JournalFeedback> => {
  const generationConfig: GenerationConfig = {
    responseMimeType: "application/json",
    responseSchema: journalSchema
  };

  const prompt = `Text del diari (adolescent): """${text}"""
En català, respon amb:
- 2-3 fortaleses/validacions empàtiques
- 2-3 suggeriments pràctics de regulació/accions
- Un breu resum animador.`;

  try {
    const result = await runWithRetry(async () =>
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig
      })
    );
    return JSON.parse(result.response.text());
  } catch (e) {
    console.error("Error analyzeJournalEntry:", e);
    return { strengths: [], suggestions: [], summary: "Gràcies per compartir. Cuida’t i parla amb algú de confiança." };
  }
};
