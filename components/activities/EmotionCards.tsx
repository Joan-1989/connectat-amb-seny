// components/activities/EmotionCards.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveEmotionCardsResult } from '../../services/firestoreService';
import type {
  EmotionScenario,
  StrategyBin,
  EmotionCardResult,
} from '../../types';

// --- Dades base (pots moure-les a /data si vols) ---
const SCENARIOS: EmotionScenario[] = [
  {
    id: 'foto-incomoda',
    text: "Un amic publica una foto teva que no t'agrada.",
    correctStrategyId: 'posar-limit',
  },
  {
    id: 'discussio-company',
    text: "Has discutit amb un company i estàs molt alterat/da.",
    correctStrategyId: 'respirar-pausa',
  },
  {
    id: 'pressio-festa',
    text: 'Un amic t’insisteix perquè vagis a una festa però no et ve de gust.',
    correctStrategyId: 'posar-limit',
  },
  {
    id: 'missatge-desagradable',
    text: 'Has rebut un missatge desagradable en un grup.',
    correctStrategyId: 'demanar-ajuda',
  },
  {
    id: 'rumor',
    text: 'Circula un rumor fals sobre tu a l’institut.',
    correctStrategyId: 'demanar-ajuda',
  },
];

const BINS: StrategyBin[] = [
  {
    id: 'posar-limit',
    title: 'Posar un límit',
    description: 'Dir NO / demanar canvis de manera assertiva.',
  },
  {
    id: 'respirar-pausa',
    title: 'Respirar / Pausa',
    description: "Regular intensitat i calmar-se abans d'actuar.",
  },
  {
    id: 'demanar-ajuda',
    title: 'Demanar ajuda',
    description: 'Parlar amb un adult/amic de confiança o reportar.',
  },
  {
    id: 'reformulacio',
    title: 'Reformulació positiva',
    description: 'Buscar una mirada alternativa i més constructiva.',
  },
];

// --- UI Helpers ---
function classNames(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(' ');
}

type AssignMap = Record<string, string>; // scenarioId -> binId

type Toast = { msg: string; kind: 'success' | 'error' } | null;

export default function EmotionCards(): React.ReactElement {
  const { currentUser } = useAuth();
  const [assign, setAssign] = useState<AssignMap>({});
  const [selects, setSelects] = useState<Record<string, string>>({});
  const [overBin, setOverBin] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [saving, setSaving] = useState(false);

  const remaining = useMemo(
    () => SCENARIOS.filter(s => !assign[s.id]),
    [assign]
  );

  // Auto-toast hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  // Desa automàtic si tot assignat
  useEffect(() => {
    if (!currentUser) return;
    if (remaining.length > 0) return;

    const allResults: EmotionCardResult[] = SCENARIOS.map(s => ({
      scenarioId: s.id,
      droppedIn: assign[s.id],
      correct: assign[s.id] === s.correctStrategyId,
    }));

    (async () => {
      try {
        setSaving(true);
        await saveEmotionCardsResult(currentUser.uid, allResults);
        setToast({ msg: 'Sessió guardada al teu Progrés ✅', kind: 'success' });
      } catch (e) {
        console.error(e);
        setToast({ msg: 'No s’ha pogut desar la sessió.', kind: 'error' });
      } finally {
        setSaving(false);
      }
    })();
  }, [assign, currentUser, remaining.length]);

  // Drag handlers
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, scenarioId: string) => {
    e.dataTransfer.setData('text/plain', scenarioId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, binId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (overBin !== binId) setOverBin(binId);
  };

  const onDragLeave = (binId: string) => {
    if (overBin === binId) setOverBin(null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, binId: string) => {
    e.preventDefault();
    const scenarioId = e.dataTransfer.getData('text/plain');
    if (!scenarioId) return;
    assignScenario(scenarioId, binId);
    setOverBin(null);
  };

  // Assign via selector/botó
  const assignScenario = (scenarioId: string, binId: string) => {
    setAssign(prev => ({ ...prev, [scenarioId]: binId }));
    setSelects(prev => ({ ...prev, [scenarioId]: '' }));

    const s = SCENARIOS.find(x => x.id === scenarioId);
    const correct = s ? s.correctStrategyId === binId : false;
    setToast({
      msg: correct ? 'Ben vist! ✔️' : 'Es pot millorar. Prova una altra opció ❗',
      kind: correct ? 'success' : 'error',
    });
  };

  const resetAll = () => {
    setAssign({});
    setSelects({});
    setToast({ msg: 'Sessió reiniciada', kind: 'success' });
  };

  // Construïm les targetes ja col·locades per bin
  const placedByBin: Record<string, EmotionScenario[]> = useMemo(() => {
    const map: Record<string, EmotionScenario[]> = {};
    BINS.forEach(b => { map[b.id] = []; });
    SCENARIOS.forEach(s => {
      const b = assign[s.id];
      if (b && map[b]) map[b].push(s);
    });
    return map;
  }, [assign]);

  return (
    <section className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-brand-dark">Cartes d’Emocions</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Reinicia
          </button>
          <span className="text-sm text-gray-500">
            {Object.keys(assign).length}/{SCENARIOS.length} col·locades
            {saving && <span className="ml-2 text-brand-primary">Desant…</span>}
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Arrossega cada situació cap a l’estratègia que millor s’hi ajusta <em>o</em> usa el selector “Assignar”.
      </p>

      {/* Layout: Situacions + Bins */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Situacions */}
        <div className="md:col-span-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Situacions</h4>
          <div className="space-y-3">
            {remaining.map(s => (
              <div key={s.id} className="rounded-lg border p-3">
                <div
                  draggable
                  onDragStart={(e) => onDragStart(e, s.id)}
                  className="cursor-grab rounded-md bg-gray-50 p-2 text-sm text-gray-800 active:cursor-grabbing"
                  aria-grabbed="true"
                >
                  {s.text}
                </div>

                {/* Selector accessible */}
                <div className="mt-2 flex items-center gap-2">
                  <label htmlFor={`sel-${s.id}`} className="sr-only">Tria estratègia</label>
                  <select
                    id={`sel-${s.id}`}
                    value={selects[s.id] ?? ''}
                    onChange={e => setSelects(prev => ({ ...prev, [s.id]: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="">— Tria estratègia —</option>
                    {BINS.map(b => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selects[s.id]}
                    onClick={() => selects[s.id] && assignScenario(s.id, selects[s.id])}
                    className="rounded-md bg-brand-primary px-3 py-2 text-sm font-semibold text-white enabled:hover:bg-brand-secondary disabled:bg-gray-300"
                  >
                    Assignar
                  </button>
                </div>
              </div>
            ))}

            {remaining.length === 0 && (
              <p className="text-sm text-gray-500">No queden situacions pendents. 🎉</p>
            )}
          </div>
        </div>

        {/* Bins / Destinacions */}
        <div className="md:col-span-8">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Estratègies</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {BINS.map(bin => {
              const isOver = overBin === bin.id;
              return (
                <div
                  key={bin.id}
                  onDragOver={(e) => onDragOver(e, bin.id)}
                  onDragLeave={() => onDragLeave(bin.id)}
                  onDrop={(e) => onDrop(e, bin.id)}
                  className={classNames(
                    'min-h-[150px] rounded-lg border p-3 transition-colors',
                    isOver ? 'border-brand-primary bg-blue-50/60' : 'border-gray-200 bg-gray-50'
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-gray-800">{bin.title}</h5>
                      <p className="text-xs text-gray-600">{bin.description}</p>
                    </div>
                    <span
                      className={classNames(
                        'rounded-full px-2 py-0.5 text-xs',
                        placedByBin[bin.id]?.length
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {placedByBin[bin.id]?.length ?? 0}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-2">
                    {(placedByBin[bin.id] ?? []).map(s => {
                      const correct = s.correctStrategyId === bin.id;
                      return (
                        <li
                          key={s.id}
                          className={classNames(
                            'rounded-md p-2 text-sm',
                            correct
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          )}
                        >
                          {s.text}
                        </li>
                      );
                    })}
                    {/* indicador buit */}
                    {(placedByBin[bin.id] ?? []).length === 0 && (
                      <li className="rounded-md border border-dashed border-gray-300 p-2 text-center text-xs text-gray-400">
                        Arrossega aquí
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={classNames(
            'fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 shadow-lg',
            toast.kind === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          )}
        >
          {toast.msg}
        </div>
      )}
    </section>
  );
}
