// services/seedClient.ts
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import type { Article, Myth } from '../types';

export async function upsertArticlesAndMyths(
  articles: Article[],
  myths: Myth[]
): Promise<{ articles: number; myths: number }> {
  const batch = writeBatch(db);

  const aCol = collection(db, 'articles');
  for (const a of articles) {
    const { id, ...rest } = a;
    const ref = doc(aCol, id);
    batch.set(ref, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
  }

  const mCol = collection(db, 'myths');
  for (const m of myths) {
    const { id, ...rest } = m;
    const ref = doc(mCol, id);
    batch.set(ref, { ...rest, updatedAt: serverTimestamp() }, { merge: true });
  }

  await batch.commit();
  return { articles: articles.length, myths: myths.length };
}
