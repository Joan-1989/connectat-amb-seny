// types.ts — versió unificada i compatible amb el projecte

/* ====== Missatgeria (Gemini) ====== */
export type Role = 'user' | 'model';

export interface ChatPart {
  text: string;
}

export interface ChatMessage {
  id?: string;
  role: Role;
  parts: ChatPart[];
  userId?: string;
  // Mantingut com 'any' per compat amb definicions anteriors
  timestamp?: any;
}

/* ====== Quiz / Escenaris de xat ====== */
export interface QuizQuestion {
  pregunta: string;
  opcions: string[];
  resposta_correcta: string;
}

export interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  initialMessage: string;
}

/* ====== Activitats: Cartes d’Emocions ====== */
export interface EmotionScenario {
  id: string;
  text: string;              // Escenari / situació
  correctStrategyId: string; // ID de l’estratègia correcta
}

export interface StrategyBin {
  id: string;
  title: string;
  description: string;
}

export interface EmotionCardResult {
  scenarioId: string;
  droppedIn: string; // bin id
  correct: boolean;
}

/* ====== Activitats: Roleplay ====== */
export interface RoleplayState {
  topic: string;
  // Historial de conversa; NOMÉS 'user' | 'model'
  context: ChatMessage[];
}

export interface RoleplayOption {
  id: string;
  label: string;
}

export interface RoleplayStep {
  npcSay: string;
  options: RoleplayOption[];
}

/* ====== Activitats: Dilemes Socials ====== */
export interface SocialDilemma {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
}

/* ====== Activitats: Diari de Reflexió ====== */
export interface JournalFeedback {
  strengths: string[];
  suggestions: string[];
  summary: string;
}

/* ====== Gamificació / Perfil ====== */
export type ProfileType =
  | 'adolescent'
  | 'pare'
  | 'docent'
  | 'Adolescent'
  | 'Tutor'
  | 'Professional';


export interface UserProfile {
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  type: ProfileType;
  age?: number;
}
export type ActiveModule = "Informa't" | "Entrena't" | "Activa't" | "Perfil";


export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji o ruta d’imatge
}
