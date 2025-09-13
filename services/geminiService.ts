import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerationConfig, FunctionDeclarationSchemaType } from "@google/generative-ai";
import type { QuizQuestion, ChatMessage, ChatScenario } from "./../types";

// Agafa la clau API de les variables d'entorn de Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY no està definida. Si us plau, revisa el teu arxiu .env.local");
}

const genAI = new GoogleGenerativeAI({ apiKey: API_KEY });

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

// Funció genèrica per executar crides a la API amb reintents
async function runWithRetry<T>(apiCall: () => Promise<T>, retries = 3, initialDelay = 1000): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await apiCall();
        } catch (error: any) {
            if (error.status === 503 && attempt < retries - 1) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.warn(`Servei sobrecarregat. Reintentant en ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                attempt++;
            } else {
                throw error;
            }
        }
    }
    throw new Error("La crida a l'API ha fallat després de varis intents.");
}

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    const generationConfig: GenerationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: FunctionDeclarationSchemaType.ARRAY,
            items: {
                type: FunctionDeclarationSchemaType.OBJECT,
                properties: {
                    pregunta: { type: FunctionDeclarationSchemaType.STRING },
                    opcions: {
                        type: FunctionDeclarationSchemaType.ARRAY,
                        items: { type: FunctionDeclarationSchemaType.STRING }
                    },
                    resposta_correcta: { type: FunctionDeclarationSchemaType.STRING }
                },
                required: ["pregunta", "opcions", "resposta_correcta"]
            }
        },
    };
    try {
        const result = await runWithRetry(async () => await model.generateContent({
            contents: [{ role: "user", parts: [{ text: `Genera un qüestionari de 5 preguntes de selecció múltiple en català sobre el tema "${topic}" per a adolescents. Assegura't que cada pregunta tingui 4 opcions.` }] }],
            generationConfig,
        }));
        const response = result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

export const generateWellbeingPlan = async (answers: string[]): Promise<{ consells: string[]; reptes: string[] }> => {
    const prompt = `Basant-se en aquestes respostes d'autoavaluació d'un adolescent sobre els seus hàbits digitals, genera un pla de benestar digital personalitzat en català. Les respostes són: ${answers.join(', ')}. Proporciona 3 consells i 3 reptes setmanals.`;
    const generationConfig: GenerationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: FunctionDeclarationSchemaType.OBJECT,
            properties: {
                consells: {
                    type: FunctionDeclarationSchemaType.ARRAY,
                    items: { type: FunctionDeclarationSchemaType.STRING },
                },
                reptes: {
                    type: FunctionDeclarationSchemaType.ARRAY,
                    items: { type: FunctionDeclarationSchemaType.STRING },
                }
            },
            required: ["consells", "reptes"]
        }
    };
    try {
        const result = await runWithRetry(async () => await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        }));
        const response = result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Error generating wellbeing plan:", error);
        return { consells: [], reptes: [] };
    }
};

export const generateChatResponse = async (history: ChatMessage[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const chat = model.startChat({
            history,
            systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
        });
        const result = await runWithRetry(async () => await chat.sendMessage(newMessage));
        const response = result.response;
        return response.text();
    } catch(error) {
        console.error("Error generating chat response:", error);
        return "Uups! Sembla que he tingut un problema per respondre. Prova-ho de nou.";
    }
};

export const generateConversationStarters = async (topic: string): Promise<string[]> => {
    const prompt = `Genera 5 iniciadors de conversa en català per a pares/educadors per parlar amb adolescents sobre "${topic}". Han de ser preguntes obertes i no judicials.`;
    const generationConfig: GenerationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
            type: FunctionDeclarationSchemaType.ARRAY,
            items: {
                type: FunctionDeclarationSchemaType.STRING,
            },
        }
    };
     try {
        const result = await runWithRetry(async () => await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        }));
        const response = result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Error generating conversation starters:", error);
        return [];
    }
};

