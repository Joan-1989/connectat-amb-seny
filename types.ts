export enum ProfileType {
  Jove = "Jove",
  Tutor = "Mare/Pare/tutor/a",
  Professional = "Professional/Educador/a",
}

export interface UserProfile {
  type: ProfileType;
  age?: number;
}

export interface User {
  uid: string;
  email: string;
  profile: UserProfile;
}

export type ActiveModule = "Informa't" | "Entrena't" | "Activa't" | "Perfil";

export interface Article {
  id: string;
  titol: string;
  contingut: string;
  categoria: string;
  tipus_media: 'imatge' | 'video';
  url_media: string;
}

export interface QuizQuestion {
  pregunta: string;
  opcions: string[];
  resposta_correcta: string;
}

export type BadgeId = 'detox-bronze' | 'first-diary' | 'myth-buster';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string; // Emoji or identifier for an icon component
}

export interface Myth {
  id: string;
  statement: string;
  isMyth: boolean;
  explanation: string;
}

export type Mood = 'Feliç' | 'Trist' | 'Enfadat' | 'Ansiós' | 'Relaxat' | 'Normal';

export interface MoodEntry {
  date: string;
  text: string;
  mood: Mood;
}

export interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  initialMessage: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// FIX: Add global type definitions for Vite's `import.meta.env` to resolve TypeScript errors.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_FIREBASE_API_KEY: string;
      readonly VITE_FIREBASE_AUTH_DOMAIN: string;
      readonly VITE_FIREBASE_PROJECT_ID: string;
      readonly VITE_FIREBASE_STORAGE_BUCKET: string;
      readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      readonly VITE_FIREBASE_APP_ID: string;
    };
  }
}