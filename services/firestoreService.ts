import { db } from './firebase';
import type { Article, Myth } from '../types';
// Importa les funcions modulars v9+
import { collection, getDocs } from 'firebase/firestore';


export const getArticles = async (): Promise<Article[]> => {
    // Utilitza la nova API modular per a Firestore
    const articlesCol = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesCol);
    const articlesList = articlesSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    })) as Article[];
    return articlesList;
}

export const getMyths = async (): Promise<Myth[]> => {
    // Utilitza la nova API modular per a Firestore
    const mythsCol = collection(db, 'myths');
    const mythsSnapshot = await getDocs(mythsCol);
    const mythsList = mythsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    })) as Myth[];
    return mythsList;
}
