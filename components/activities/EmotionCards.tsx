import React, { useMemo, useState } from 'react';
import type { EmotionScenario, StrategyBin, EmotionCardResult } from '../../types';

const SCENARIOS: EmotionScenario[] = [
  { id: 'sc1', text: 'Un amic publica una foto teva que no t’agrada.', correctStrategyId: 'limit' },
  { id: 'sc2', text: 'T’has discutit amb un company per un treball.', correctStrategyId: 'respiro' },
  { id: 'sc3', text: 'T’han deixat en vist al grup i et sents exclòs/osa.', correctStrategyId: 'reformula' },
  { id: 'sc4', text: 'Exàmens a prop i notes pressió.', correctStrategyId: 'planifica' },
];

const BINS: StrategyBin[] = [
  { id: 'limit', title: 'Posar un límit', description: 'Dir NO/ demanar canvis de manera assertiva.' },
  { id: 'respiro', title: 'Respirar / Pausa', description: 'Regular intensitat abans d’actuar.' },
  { id: 'reformula', title: 'Reformulació', description: 'Pensament alternatiu més realista.' },
  { id: 'planifica', title: 'Planificació', description: 'Passos concrets i prioritzar.' },
];

export default function EmotionCards(): React.ReactElement {
  const [results, setResults] = useState<EmotionCardResult[]>([]);
  const remaining = useMemo(
    () => SCENARIOS.filter(s => !results.find(r => r.scenarioId === s.id)),
    [results]
  );

  function onDropScenario(scenarioId: string, binId: string) {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    const correct = scenario.correctStrategyId === binId;
    setResults(prev => [...prev, { scenarioId, droppedIn: binId, correct }]);
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-brand-dark mb-1">Cartes d’Emocions</h2>
      <p className="text-gray-600 mb-4">Arrossega cada situació cap a l’estratègia que millor s’hi ajusta.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna: cartes pendents */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-2">Situacions</h3>
          <div className="space-y-3">
            {remaining.map(s => (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', s.id)}
                className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-grab"
              >
                {s.text}
              </div>
            ))}
            {remaining.length === 0 && (
              <div className="text-sm text-gray-500">🎉 Ja has col·locat totes les cartes!</div>
            )}
          </div>
        </div>

        {/* Columnes: contenidors d’estratègies */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {BINS.map(bin => (
            <div
              key={bin.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const sId = e.dataTransfer.getData('text/plain');
                onDropScenario(sId, bin.id);
              }}
              className="rounded-xl border-2 border-dashed p-4 min-h-[140px] bg-gray-50"
            >
              <div className="font-semibold">{bin.title}</div>
              <div className="text-sm text-gray-500 mb-2">{bin.description}</div>

              <div className="space-y-2">
                {results
                  .filter(r => r.droppedIn === bin.id)
                  .map(r => {
                    const s = SCENARIOS.find(x => x.id === r.scenarioId)!;
                    return (
                      <div
                        key={r.scenarioId}
                        className={`p-2 rounded-lg text-sm ${
                          r.correct ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                        }`}
                      >
                        {s.text} — {r.correct ? '✅ Correcte' : '❌ Millor una altra estratègia'}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resum */}
      <div className="mt-4">
        <div className="text-sm">
          <span className="font-semibold">Resultat: </span>
          {results.filter(r => r.correct).length}/{SCENARIOS.length} correctes
        </div>
      </div>
    </div>
  );
}
