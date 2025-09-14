// components/modules/ModuleProgres.tsx
import React, { useEffect, useState } from 'react';
import type {
  EmotionCardsSessionDoc,
  RoleplaySessionDoc,
  JournalEntryDoc,
  JournalFeedback
} from '../../types';
import {
  listEmotionCardsSessions,
  listRoleplaySessions,
  listJournalEntries
} from '../../services/firestoreService';
import { useAuth } from '../../context/AuthContext';

export default function ModuleProgres(): React.ReactElement {
  const { currentUser } = useAuth();
  const [emotionSessions, setEmotionSessions] = useState<EmotionCardsSessionDoc[]>([]);
  const [roleplaySessions, setRoleplaySessions] = useState<RoleplaySessionDoc[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      setLoading(true);
      try {
        // Aquests serveis poden retornar tipus "bàsics". Derivem els Doc aquí.
        const eRaw: any[] = await listEmotionCardsSessions(currentUser.uid);
        const rRaw: any[] = await listRoleplaySessions(currentUser.uid);
        const jRaw: any[] = await listJournalEntries(currentUser.uid);

        const e: EmotionCardsSessionDoc[] = eRaw.map((x) => ({
          id: x.id ?? crypto.randomUUID(),
          createdAt: x.createdAt ?? x.timestamp ?? new Date(),
          total: typeof x.total === 'number' ? x.total : Array.isArray(x.results) ? x.results.length : (x.correct ?? 0) + (x.incorrect ?? 0) || 0,
          correct: typeof x.correct === 'number' ? x.correct : (Array.isArray(x.results) ? x.results.filter((r: any) => r?.correct === true).length : (x.correct ?? 0)),
        }));

        const r: RoleplaySessionDoc[] = rRaw.map((x) => ({
          id: x.id ?? crypto.randomUUID(),
          createdAt: x.createdAt ?? x.timestamp ?? new Date(),
          topic: x.topic ?? x.title ?? 'Roleplay',
          stepsCount: typeof x.stepsCount === 'number' ? x.stepsCount : (Array.isArray(x.context) ? x.context.length : (x.steps ?? 0)),
        }));

        const j: JournalEntryDoc[] = jRaw.map((x) => ({
          id: x.id ?? crypto.randomUUID(),
          createdAt: x.createdAt ?? x.timestamp ?? new Date(),
          text: x.text ?? x.entry ?? '',
          feedback: (x.feedback ?? {
            strengths: [],
            suggestions: [],
            summary: ''
          }) as JournalFeedback
        }));

        setEmotionSessions(e);
        setRoleplaySessions(r);
        setJournalEntries(j);
      } catch (err) {
        console.error('Error carregant progrés:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  return (
    <section className="animate-fade-in" aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-2xl font-bold text-brand-dark mb-4">
        Progrés
      </h2>

      {loading && <p className="text-sm text-gray-600">Carregant…</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cartes d’emocions */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-brand-dark mb-2">Cartes d’emocions</h3>
          {emotionSessions.length === 0 ? (
            <p className="text-sm text-gray-500">Encara no hi ha sessions.</p>
          ) : (
            <ul className="space-y-2">
              {emotionSessions.map(s => (
                <li key={s.id} className="border rounded p-2 text-sm flex justify-between">
                  <span>{new Date(s.createdAt?.toDate?.() ?? s.createdAt).toLocaleDateString()}</span>
                  <span>{s.correct}/{s.total} encerts</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Roleplay */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-brand-dark mb-2">Roleplay</h3>
          {roleplaySessions.length === 0 ? (
            <p className="text-sm text-gray-500">Encara no hi ha sessions.</p>
          ) : (
            <ul className="space-y-2">
              {roleplaySessions.map(s => (
                <li key={s.id} className="border rounded p-2 text-sm flex justify-between">
                  <span>{s.topic}</span>
                  <span>{s.stepsCount} passos</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Diari */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-brand-dark mb-2">Diari</h3>
          {journalEntries.length === 0 ? (
            <p className="text-sm text-gray-500">Encara no hi ha entrades.</p>
          ) : (
            <ul className="space-y-2">
              {journalEntries.map(e => (
                <li key={e.id} className="border rounded p-2 text-sm">
                  <div className="font-medium mb-1">
                    {new Date(e.createdAt?.toDate?.() ?? e.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-700 line-clamp-2">{e.text}</div>
                  {e.feedback?.summary && (
                    <div className="mt-1 text-xs text-gray-500">
                      <strong>Feedback:</strong> {e.feedback.summary}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
