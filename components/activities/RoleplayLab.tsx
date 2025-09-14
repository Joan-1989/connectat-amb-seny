// components/activities/RoleplayLab.tsx
import React, { useEffect, useState } from 'react';
import type { ChatMessage, RoleplayState, RoleplayStep, RoleplayOption } from '../../types';
import { generateRoleplayStep } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import {
  startRoleplaySession,
  appendRoleplayTurn,
  finishRoleplaySession,
} from '../../services/firestoreService';
import { checkAndConsumeQuota } from '../../services/rateLimitService';

const INITIAL_CONTEXT: ChatMessage[] = [];

export default function RoleplayLab(): React.ReactElement {
  const { currentUser } = useAuth();
  const uid = (currentUser as any)?.uid as string | undefined;

  const [state, setState] = useState<RoleplayState>({
    topic: 'Dir NO a una pressió per anar a una festa',
    context: INITIAL_CONTEXT,
  });
  const [step, setStep] = useState<RoleplayStep | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Inicia la sessió i genera el primer pas
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Quota (si hi ha usuari loguejat)
        if (uid) {
          const q = await checkAndConsumeQuota(uid, 'roleplay');
          if (!q.ok) {
            setError(q.reason ?? 'Has superat el límit. Torna-ho a provar més tard.');
            setLoading(false);
            return;
          }
        }

        // Crea sessió a Firestore (si hi ha usuari)
        let sid = sessionId;
        if (uid && !sid) {
          sid = await startRoleplaySession(uid, state.topic);
          setSessionId(sid);
        }

        // Primer pas del NPC
        const s = await generateRoleplayStep(state);

        setState(prev => ({
          ...prev,
          context: [...prev.context, { role: 'model', parts: [{ text: s.npcSay }] }],
        }));
        setStep(s);
        setStepIndex(0);

        // Desa primer turn (NPC parla)
        if (uid && sid) {
          await appendRoleplayTurn(uid, sid, 0, s.npcSay);
        }
      } catch (e) {
        console.error('Roleplay init error:', e);
        setError('No s’ha pogut iniciar el roleplay. Torna-ho a provar.');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // només al muntar

  async function loadStep(choice?: RoleplayOption) {
    setLoading(true);
    setError(null);
    try {
      // Quota per cada pas (si hi ha usuari)
      if (uid) {
        const q = await checkAndConsumeQuota(uid, 'roleplay');
        if (!q.ok) {
          setError(q.reason ?? 'Has superat el límit. Torna-ho a provar més tard.');
          setLoading(false);
          return;
        }
      }

      // Demana el següent pas al model
      const s = await generateRoleplayStep(state, choice?.label);

      // Construeix el nou context (sense mutar)
      setState(prev => {
        const newContext = [...prev.context];
        if (choice) {
          newContext.push({ role: 'user', parts: [{ text: `Usuari tria: ${choice.label}` }] });
        }
        newContext.push({ role: 'model', parts: [{ text: s.npcSay }] });
        return { ...prev, context: newContext };
      });
      setStep(s);

      // Desa el turn a Firestore
      if (uid && sessionId) {
        const nextIndex = stepIndex + 1;
        await appendRoleplayTurn(uid, sessionId, nextIndex, s.npcSay, choice?.label);
        setStepIndex(nextIndex);
      }
    } catch (e) {
      console.error('Roleplay step error:', e);
      setError('No s’ha pogut continuar el roleplay ara mateix.');
    } finally {
      setLoading(false);
    }
  }

  async function endSession() {
    if (!uid || !sessionId) return;
    try {
      await finishRoleplaySession(uid, sessionId);
    } catch (e) {
      console.error('Finish roleplay error:', e);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-dark mb-1">Roleplay Ramificat</h2>
          <p className="text-gray-600 mb-2">
            Tema: <span className="font-semibold">{state.topic}</span>
          </p>
        </div>
        <button
          onClick={endSession}
          disabled={!sessionId}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
        >
          Acabar sessió
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 rounded bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div
  className="min-h-[120px] p-3 rounded-lg bg-gray-50 border"
  aria-live="polite"
  aria-atomic="false"
>
  {loading ? 'Generant...' : (step?.npcSay || '...')}
</div>


      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {step?.options?.map(opt => (
          <button
            key={opt.id}
            onClick={() => loadStep(opt)}
            disabled={loading}
            className="text-left p-3 rounded-lg border bg-gray-100 hover:bg-gray-200"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {state.context.length > 0 && (
        <div className="mt-5">
          <h3 className="font-semibold mb-2">Historial</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {state.context.map((m, i) => (
              <div
                key={i}
                className={`text-sm ${m.role === 'user' ? 'text-blue-700' : 'text-gray-800'}`}
              >
                <strong>{m.role === 'user' ? 'Tu:' : 'NPC:'}</strong> {m.parts[0]?.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
