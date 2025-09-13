// services/firestoreService.ts

import { db } from './firebase';
import type { Article, Myth, ChatMessage } from '../types'; // <-- Afegim el tipus ChatMessage
// Importa les funcions modulars v9+
import {
  collection,
  getDocs,
  addDoc,         // <-- Nou import per afegir documents
  query,          // <-- Nou import per a consultes
  orderBy,        // <-- Nou import per ordenar
  onSnapshot,     // <-- Nou import per a escoltar en temps real
  Timestamp,      // <-- Nou import per a marques de temps
} from 'firebase/firestore';

// =======================================================
// FUNCIONS ORIGINALS (PER OBTENIR ARTICLES I MITES)
// =======================================================

export const getArticles = async (): Promise<Article[]> => {
  const articlesCol = collection(db, 'articles');
  const articlesSnapshot = await getDocs(articlesCol);
  const articlesList = articlesSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Article[];
  return articlesList;
};

export const getMyths = async (): Promise<Myth[]> => {
  const mythsCol = collection(db, 'myths');
  const mythsSnapshot = await getDocs(mythsCol);
  const mythsList = mythsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Myth[];
  return mythsList;
};

// =======================================================
// NOVES FUNCIONS (PER AL XAT EN TEMPS REAL)
// =======================================================

/**
 * Envia un missatge a una sala de xat específica a Firestore.
 * @param chatId L'identificador de la sala de xat.
 * @param message L'objecte del missatge a enviar.
 */
export const sendMessage = async (
  chatId: string,
  message: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<void> => {
  try {
    const messagesCol = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCol, {
      ...message,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error a l'enviar el missatge:", error);
    throw new Error('No es pot enviar el missatge');
  }
};

/**
 * Escolta els missatges d'un xat en temps real i executa un callback amb les dades.
 * @param chatId L'identificador de la sala de xat.
 * @param callback La funció que s'executarà cada cop que hi hagi canvis.
 * @returns Una funció per a cancel·lar la subscripció (unsubscribe).
 */
export const onMessagesSnapshot = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const messagesCol = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesCol, orderBy('timestamp'));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          ...data,
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