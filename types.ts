// --- Tipus Generals ---
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

// --- Mòdul Informa't ---
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

export interface Myth {
  id: string;
  statement: string;
  isMyth: boolean;
  explanation: string;
}

// --- Gamificació ---
export type BadgeId = 'detox-bronze' | 'first-diary' | 'myth-buster' | 'wellbeing-plan-created' | 'first-rudder-entry';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
}

// --- Mòdul Entrena't (Eines Noves) ---
export type Mood = 'Feliç' | 'Trist' | 'Enfadat' | 'Ansiós' | 'Relaxat' | 'Normal';

export interface MoodEntry {
  date: string;
  text: string;
  mood: Mood;
}

export interface WellbeingPlan {
    answers: string[];
    consejos: string[];
    reptes: string[];
    createdAt: string;
}

export type RecoveryDomain = "esperanca" | "connexio" | "identitat" | "sentit" | "apoderament" | "benestar" | "vida_social" | "inclusio";

export interface RecoveryRudderEntry {
    date: string;
    scores: Record<RecoveryDomain, number>;
}


// --- Mòdul Entrena't (Habilitats Socials) ---
export interface ChatScenario { // <--- Nom corregit (abans era Scenario)
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  initialMessage: string;
}

export interface ChatMessage {
  id?: string; // ID del document de Firestore (opcional)
  role: 'user' | 'model';
  parts: { text: string }[];
  userId?: string; // <-- AFEGIM AQUESTA PROPIETAT per identificar qui envia el missatge
  timestamp?: any; // Per a ordenar per data des de Firestore
}

// --- Variables d'entorn de Vite ---
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_GEMINI_API_KEY: string;
      readonly VITE_FIREBASE_API_KEY: string;
      readonly VITE_FIREBASE_AUTH_DOMAIN: string;
      readonly VITE_FIREBASE_PROJECT_ID: string;
      readonly VITE_FIREBASE_STORAGE_BUCKET: string;
      readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      readonly VITE_FIREBASE_APP_ID: string;
    };
  }
}

