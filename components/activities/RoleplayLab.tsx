import React, { useEffect, useState } from 'react';
import type { ChatMessage, RoleplayState, RoleplayStep, RoleplayOption } from '../../types';
import { generateRoleplayStep } from '../../services/geminiService';

const INITIAL_CONTEXT: ChatMessage[] = [];

export default function RoleplayLab(): React.ReactElement {
  const [state, setState] = useState<RoleplayState>({
    topic: 'Dir NO a una pressió per anar a una festa',
    context: INITIAL_CONTEXT
  });
  const [step, setStep] = useState<RoleplayStep | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadStep(choice?: RoleplayOption) {
    setLoading(true);
    try {
      const s = await generateRoleplayStep(state, choice?.label);
      // Afegim al context la darrera acció triada (si n'hi ha)
      if (choice) {
        state.context.push({ role: 'user', parts: [{ text: `Usuari tria: ${choice.label}` }]});
      }
      // I el que ha dit l'NPC
      state.context.push({ role: 'model', parts: [{ text: s.npcSay }]});
      setState({ ...state });
      setStep(s);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStep(); /* primer pas */ }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-brand-dark mb-1">Roleplay Ramificat</h2>
      <p className="text-gray-600 mb-4">Tema: <span className="font-semibold">{state.topic}</span></p>

      <div className="min-h-[120px] p-3 rounded-lg bg-gray-50 border">
        {loading ? 'Generant...' : (step?.npcSay || '...')}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {step?.options.map(opt => (
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
              <div key={i} className={`text-sm ${m.role === 'user' ? 'text-blue-700' : 'text-gray-800'}`}>
                <strong>{m.role === 'user' ? 'Tu:' : 'NPC:'}</strong> {m.parts[0].text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
