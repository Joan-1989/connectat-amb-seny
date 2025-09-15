// services/firestoreService.ts
import { db } from './firebase';
import type {
  Article,
  Myth,
  ChatMessage,
  EmotionCardResult,
  JournalFeedback,
} from '../types';

import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

// (Opcional) llavors de contingut recomanat amb imatges/vídeo
// crea el fitxer data/seedContent.ts amb SEED_ARTICLES i SEED_MYTHS
import { SEED_ARTICLES, SEED_MYTHS } from '../data/seedContent';

// ---------- Helpers ----------
function truncate(s: string, n = 60): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

// ---------- Normalització (accepta múltiples esquemes de camps) ----------
function normalizeArticle(raw: any, id: string): Article {
  const title = raw?.title ?? raw?.titol ?? raw?.name ?? 'Article sense títol';
  const summary = raw?.summary ?? raw?.resum ?? raw?.description ?? '';
  const content = raw?.content ?? raw?.contingut ?? raw?.text ?? null;

  const mediaUrl = raw?.mediaUrl ?? raw?.url_media ?? null;
  const mediaType = raw?.mediaType ?? raw?.tipus_media ?? null; // 'image' | 'video'
  const category = raw?.category ?? raw?.categoria ?? null;

  return { id, title, summary, content, mediaUrl, mediaType, category };
}

function unmapArticle(a: Article) {
  // guardem en català per compatibilitat amb la teva DB
  return {
    titol: a.title,
    summary: a.summary ?? '',
    contingut: a.content ?? '',
    categoria: a.category ?? null,
    tipus_media: a.mediaType ?? (a.mediaUrl ? 'image' : null),
    url_media: a.mediaUrl ?? null,
  };
}

function normalizeMyth(raw: any, id: string): Myth {
  // Accepta:
  // - { title, myth, reality, isMyth }
  // - { titol, mite, realitat }
  // - { statement, explanation, isMyth }
  const statement =
    raw?.statement ?? raw?.myth ?? raw?.mite ?? raw?.enunciat ?? '';
  const explanation =
    raw?.explanation ?? raw?.reality ?? raw?.realitat ?? raw?.explicacio ?? '';
  const titleBase = raw?.title ?? raw?.titol ?? (statement || 'Mite');
  const isMyth = typeof raw?.isMyth === 'boolean' ? raw.isMyth : true;

  return {
    id,
    title: String(titleBase).slice(0, 60),
    myth: String(statement),
    reality: String(explanation),
    isMyth,
  };
}

function unmapMyth(m: Myth) {
  return {
    title: m.title,
    statement: m.myth,
    explanation: m.reality,
    isMyth: m.isMyth ?? true,
  };
}

// =======================================================
// ARTICLES & MYTHS (Firestore)
// =======================================================
export const getArticles = async (): Promise<Article[]> => {
  const articlesCol = collection(db, 'articles');
  const snap = await getDocs(articlesCol);
  return snap.docs.map((d) => normalizeArticle(d.data(), d.id));
};

export const getMyths = async (): Promise<Myth[]> => {
  const mythsCol = collection(db, 'myths');
  const snap = await getDocs(mythsCol);
  return snap.docs.map((d) => normalizeMyth(d.data(), d.id));
};

// Seed “un cop”: crea articles + mites si la DB és buida (o no s’ha fet mai)
export async function seedPublicContentOnce(): Promise<{ articles: number; myths: number }> {
  const flagRef = doc(db, 'settings', 'seed_v1');
  const flagSnap = await getDoc(flagRef);
  if (flagSnap.exists()) return { articles: 0, myths: 0 };

  let a = 0;
  for (const art of SEED_ARTICLES) {
    await setDoc(doc(db, 'articles', art.id), unmapArticle(art), { merge: true });
    a++;
  }
  let m = 0;
  for (const myth of SEED_MYTHS) {
    await setDoc(doc(db, 'myths', myth.id), unmapMyth(myth), { merge: true });
    m++;
  }
  await setDoc(flagRef, { at: serverTimestamp(), version: 1 }, { merge: true });

  return { articles: a, myths: m };
}

// =======================================================
// CHAT (temps real)
// =======================================================
export const sendMessage = async (
  chatId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<void> => {
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesCol, {
    ...message,
    timestamp: serverTimestamp(),
  });
};

export const onMessagesSnapshot = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesCol, orderBy('timestamp'));

  return onSnapshot(
    q,
    (qs) => {
      const messages: ChatMessage[] = [];
      qs.forEach((d) => {
        const data = d.data() as any;
        messages.push({
          id: d.id,
          role: data.role,
          parts: data.parts,
          userId: data.userId,
          timestamp: data.timestamp,
        } as ChatMessage);
      });
      callback(messages);
    },
    (error) => {
      console.error('Error en la subscripció als missatges:', error);
    }
  );
};

// =======================================================
// ROLEPLAY (sessions + torns)
// =======================================================
export type RoleplaySession = {
  id: string;
  topic: string;
  startedAt: any;
  finishedAt?: any;
  steps: number;
  updatedAt?: any;
};

export const startRoleplaySession = async (uid: string, topic: string): Promise<string> => {
  const sessionsCol = collection(db, 'users', uid, 'roleplaySessions');
  const ref = await addDoc(sessionsCol, {
    topic,
    startedAt: serverTimestamp(),
    finishedAt: null,
    steps: 0,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const appendRoleplayTurn = async (
  uid: string,
  sessionId: string,
  stepIndex: number,
  npcSay: string,
  userChoice?: string
): Promise<void> => {
  const turnRef = doc(db, 'users', uid, 'roleplaySessions', sessionId, 'turns', String(stepIndex));
  await setDoc(turnRef, {
    stepIndex,
    npcSay,
    userChoice: userChoice ?? null,
    createdAt: serverTimestamp(),
  });
  const sessRef = doc(db, 'users', uid, 'roleplaySessions', sessionId);
  await setDoc(
    sessRef,
    { steps: stepIndex + 1, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const finishRoleplaySession = async (uid: string, sessionId: string): Promise<void> => {
  const sessRef = doc(db, 'users', uid, 'roleplaySessions', sessionId);
  await setDoc(
    sessRef,
    { finishedAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const listRoleplaySessions = async (uid: string): Promise<RoleplaySession[]> => {
  const colRef = collection(db, 'users', uid, 'roleplaySessions');
  const q = query(colRef, orderBy('startedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as RoleplaySession[];
};

// =======================================================
// EMOTION CARDS (guardar + llistar sessions)
// =======================================================
export type EmotionCardsSession = {
  id: string;
  results: EmotionCardResult[];
  createdAt: any;
};

export const saveEmotionCardsResult = async (
  uid: string,
  results: EmotionCardResult[]
): Promise<void> => {
  const colRef = collection(db, 'users', uid, 'emotionCardSessions');
  await addDoc(colRef, {
    results,
    createdAt: serverTimestamp(),
  });
};

export const listEmotionCardsSessions = async (uid: string): Promise<EmotionCardsSession[]> => {
  const colRef = collection(db, 'users', uid, 'emotionCardSessions');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as EmotionCardsSession[];
};

// =======================================================
// JOURNAL (guardar + llistar entrades)
// =======================================================
export type JournalEntry = {
  id: string;
  text: string;
  feedback?: JournalFeedback;
  createdAt: any;
};

export const saveJournalEntry = async (
  uid: string,
  text: string,
  feedback?: JournalFeedback
): Promise<string> => {
  const colRef = collection(db, 'users', uid, 'journalEntries');
  const ref = await addDoc(colRef, {
    text,
    feedback: feedback ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const listJournalEntries = async (uid: string): Promise<JournalEntry[]> => {
  const colRef = collection(db, 'users', uid, 'journalEntries');
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as JournalEntry[];
};
// =======================================================
// SCREENING: Senyals d'alerta (guardar)
// =======================================================
export type ScreeningLevel = 'baix' | 'moderat' | 'alt' | 'cap';

export interface ScreeningResultDoc {
  id: string;
  countsByCategory: Record<string, number>;
  total: number;
  level: ScreeningLevel;
  selected: { category: string; key: string }[];
  createdAt: any;
}

export const saveScreeningResult = async (
  uid: string,
  data: Omit<ScreeningResultDoc, 'id' | 'createdAt'>
): Promise<string> => {
  const colRef = collection(db, 'users', uid, 'screenings');
  const ref = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

