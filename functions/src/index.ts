// functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Inicialitza l'SDK d'Admin per a poder interactuar amb Firestore
admin.initializeApp();
const db = admin.firestore();

/**
 * Aquesta funció s'activa quan un usuari crea una nova entrada
 * al seu diari emocional.
 * Atorga una insígnia ('badge') si és la seva primera entrada.
 */
export const onNewDiaryEntry = functions
  .region("europe-west1") // És una bona pràctica especificar la regió
  .firestore.document("diaries/{userId}/entries/{entryId}")
  .onCreate(async (snap, context) => {
    const { userId } = context.params;
    const userRef = db.collection("users").doc(userId);

    functions.logger.info(`Nova entrada de diari per a l'usuari: ${userId}`);

    try {
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        functions.logger.warn(`L'usuari ${userId} no existeix.`);
        return null;
      }

      const userData = userDoc.data();
      const badges = userData?.badges || [];

      // Comprovem si l'usuari ja té la insígnia
      if (!badges.includes("first-diary")) {
        // Si no la té, l'afegim
        await userRef.update({
          badges: admin.firestore.FieldValue.arrayUnion("first-diary"),
        });
        functions.logger.log(
          `Insignia 'first-diary' atorgada a l'usuari ${userId}.`
        );
      } else {
        functions.logger.log(
          `L'usuari ${userId} ja tenia la insígnia 'first-diary'.`
        );
      }
      return null;
    } catch (error) {
      functions.logger.error(
        "Error en atorgar la insígnia 'first-diary':",
        error
      );
      return null;
    }
  });