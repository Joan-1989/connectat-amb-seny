import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { QuizQuestion, ChatMessage } from '../types';

// Inicialitza el client de l'API amb la clau des de les variables d'entorn
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      pregunta: { type: Type.STRING },
      opcions: { type: Type.ARRAY, items: { type: Type.STRING } },
      resposta_correcta: { type: Type.STRING }
    },
    required: ["pregunta", "opcions", "resposta_correcta"]
  }
};

// Funció per generar el Quiz (adaptada a la SDK instal·lada)
export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    const prompt = `Genera un qüestionari de 5 preguntes de selecció múltiple en català sobre el tema "${topic}" per a adolescents. Assegura't que cada pregunta tingui 4 opcions. Retorna només el JSON en el següent format: [{"pregunta": "...", "opcions": ["...", "...", "...", "..."], "resposta_correcta": "..."}, ...]`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        const jsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

// Funció per a la resposta del xat (adaptada a la SDK instal·lada)
export const generateChatResponse = async (history: ChatMessage[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-1.5-flash',
            config: { systemInstruction },
            history,
        });

        const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch(error) {
        console.error("Error generating chat response:", error);
        return "Uups! Sembla que he tingut un problema per respondre. Prova-ho de nou.";
    }
};

const conversationStartersSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
};

// Funció per generar iniciadors de conversa (adaptada a la SDK instal·lada)
export const generateConversationStarters = async (topic: string): Promise<string[]> => {
    const prompt = `Genera 5 iniciadors de conversa en català per a pares/educadors per parlar amb adolescents sobre "${topic}". Retorna només el JSON en format d'array de strings: ["...", "...", ...]`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: conversationStartersSchema,
            }
        });
        
        const jsonText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating conversation starters:", error);
        return [];
    }
};

