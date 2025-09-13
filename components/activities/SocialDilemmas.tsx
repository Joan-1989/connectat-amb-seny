import React, { useState } from 'react';
import type { SocialDilemma } from '../../types';
import { analyzeDilemmaChoice } from '../../services/geminiService';

const DILEMMAS: SocialDilemma[] = [
  {
    id: 'd1',
    prompt: 'Un amic et pressiona perquè comparteixis la teva contrasenya per mirar una app de pagament.',
    options: [
      { id: 'o1', label: 'Compartir-la per ajudar-lo' },
      { id: 'o2', label: 'Dir que no i explicar per què' },
      { id: 'o3', label: 'Ignorar el missatge' },
    ]
  },
  {
    id: 'd2',
    prompt: 'Al grup d’amics critiquen algú que no hi és. Et sembla injust.',
    options: [
      { id: 'o1', label: 'Canviar de tema i no dir res' },
      { id: 'o2', label: 'Dir que no et sembla bé parlar així' },
      { id: 'o3', label: 'Apuntar-te a les crítiques per integrar-te' },
    ]
  }
];

export default function SocialDilemmas(): React.ReactElement {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ pros: string[]; cons: string[]; assertiveResponse: string } | null>(null);

  const current = DILEMMAS.find(d => d.id === selected) || null;

  async function onChoose(dilemmaId: string, choiceLabel: string) {
    setLoading(true);
    setAnalysis(null);
    try {
      const d = DILEMMAS.find(x => x.id === dilemmaId)!;
      const res = await analyzeDilemmaChoice(d.prompt, choiceLabel);
      setAnalysis(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-brand-dark mb-1">Dilemes Socials</h2>
      <p className="text-gray-600 mb-4">Tria un dilema i explora pros/contres i una resposta assertiva.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Dilemes</h3>
          <div className="space-y-2">
            {DILEMMAS.map(d => (
              <button
                key={d.id}
                onClick={() => { setSelected(d.id); setAnalysis(null); }}
                className={`w-full text-left p-3 rounded-lg border ${selected === d.id ? 'bg-brand-primary text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                {d.prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {current ? (
            <div>
              <div className="p-3 rounded-lg bg-gray-50 border mb-3">{current.prompt}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {current.options.map(o => (
                  <button
                    key={o.id}
                    disabled={loading}
                    onClick={() => onChoose(current.id, o.label)}
                    className="p-3 rounded-lg border bg-gray-100 hover:bg-gray-200 text-left"
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {loading && <div className="mt-3 text-sm text-gray-600">Analitzant...</div>}

              {analysis && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded border bg-green-50">
                    <h4 className="font-semibold mb-2">Pros</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {analysis.pros.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 rounded border bg-red-50">
                    <h4 className="font-semibold mb-2">Contres</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {analysis.cons.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 rounded border bg-blue-50 md:col-span-1">
                    <h4 className="font-semibold mb-2">Resposta assertiva</h4>
                    <p className="text-sm">{analysis.assertiveResponse}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Selecciona un dilema per començar.</div>
          )}
        </div>
      </div>
    </div>
  );
}
