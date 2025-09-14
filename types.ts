// types.ts — versió unificada i compatible amb tot el projecte

// ========= Navegació de mòduls =========
export type ActiveModule = "Informa't" | "Entrena't" | "Activa't" | "Progrés" | "Perfil";


// ========= Missatgeria (Gemini) =========
export type Role = 'user' | 'model';

export interface ChatPart {
  text: string;
}

export interface ChatMessage {
  id?: string;
  role: Role;
  parts: ChatPart[];
  userId?: string;
  timestamp?: any; // Firestore Timestamp o Date
}

// ========= Continguts (Informat) =========
export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  createdAt?: any;
  // Camps usats al teu UI i al servei Firestore:
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  category?: string;
}

export interface Myth {
  id: string;
  title: string;
  myth: string;       // Afirmació / mite
  reality: string;    // Explicació
  isMyth: boolean;    // true = és un mite; false = és una realitat
}

// ========= Escenaris de xat =========
export interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  systemInstruction: string;
  initialMessage: string;
}

// ========= Activitats: Cartes d’emocions =========
export interface EmotionScenario {
  id: string;
  text: string;               // situació
  correctStrategyId: string;  // ID de l’estratègia correcta
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

// ========= Activitats: Roleplay ramificat =========
export interface RoleplayState {
  topic: string;
  context: ChatMessage[]; // NOMÉS 'user' | 'model'
}

export interface RoleplayOption {
  id: string;
  label: string;
}

export interface RoleplayStep {
  npcSay: string;
  options: RoleplayOption[];
}

// ========= Activitats: Dilemes socials =========
export interface SocialDilemma {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
}

// ========= Activitats: Diari de reflexió =========
export interface JournalFeedback {
  strengths: string[];
  suggestions: string[];
  summary: string;
}

// ========= Perfils i usuari =========
export type ProfileType = 'Jove' | 'Tutor' | 'Professional';

export interface UserProfile {
  type: ProfileType;
  age?: number;
}

// usuari que fem servir a l’app (no el de Firebase SDK directament)
export interface CurrentUser {
  uid: string;
  email: string;
  profile: UserProfile;
}

// compatibilitat enrere (si alguns fitxers importaven 'User')
export type User = CurrentUser;

// ========= Gamificació =========
export type BadgeId = string; // o union literals

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string; // emoji o classe
}

// ========= Progrés (Firestore docs simplificats) =========
export interface EmotionCardsSessionDoc {
  id: string;
  createdAt: any;
  total: number;
  correct: number;
}

export interface RoleplaySessionDoc {
  id: string;
  createdAt: any;
  topic: string;
  stepsCount: number;
}

export interface JournalEntryDoc {
  id: string;
  createdAt: any;
  text: string;
  feedback: JournalFeedback; // feedback sempre present en el Doc
}

// ========= Qüestionaris i altres utilitats =========
export interface QuizQuestion {
  pregunta: string;
  opcions: string[];
  resposta_correcta: string;
}
