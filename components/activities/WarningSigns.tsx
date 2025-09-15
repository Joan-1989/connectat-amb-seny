// components/activities/WarningSigns.tsx
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { saveScreeningResult } from '../../services/firestoreService';

type FlagCategoryId =
  | 'xarxes'
  | 'videojocs'
  | 'joc'
  | 'estatAnim'
  | 'son'
  | 'academicSocial';

type FlagItem = { key: string; label: string };
type FlagCategory = { id: FlagCategoryId; title: string; items: FlagItem[] };

const CATEGORIES: FlagCategory[] = [
  {
    id: 'xarxes',
    title: 'Xarxes i pantalles',
    items: [
      { key: 'mentides-temps', label: 'Mento sobre el temps real que hi passo' },
      { key: 'irritabilitat-absencia', label: 'M’enfado si no puc connectar-me' },
      { key: 'pensaments-constants', label: 'Penso sovint en publicar o mirar contingut' },
      { key: 'scroll-nit', label: 'Em quedo fent “scroll” tard, tot i estar cansat/da' },
    ],
  },
  {
    id: 'videojocs',
    title: 'Videojocs',
    items: [
      { key: 'temps-creixent', label: 'Cada cop necessito més temps per sentir el mateix' },
      { key: 'pèrdua-control', label: 'Em costa molt aturar-me quan m’ho proposo' },
      { key: 'aillament', label: 'He deixat altres activitats per jugar' },
    ],
  },
  {
    id: 'joc',
    title: 'Joc amb diners',
    items: [
      { key: 'diners-creixent', label: 'He augmentat diners o microtransaccions' },
      { key: 'recuperar-perdues', label: 'Intento “recuperar” pèrdues jugant més' },
      { key: 'mentides-diners', label: 'He amagat despeses a casa o amistats' },
    ],
  },
  {
    id: 'estatAnim',
    title: 'Estat d’ànim',
    items: [
      { key: 'irritabilitat', label: 'Estic més irritable si no m’hi connecto' },
      { key: 'tristesa', label: 'Em sento més trist/da quan no puc jugar/connectar-me' },
      { key: 'ansietat', label: 'Sento nervis/ansietat quan no puc “mirar”' },
    ],
  },
  {
    id: 'son',
    title: 'Son i descans',
    items: [
      { key: 'menys-hores', label: 'Dormo menys hores per estar amb pantalles' },
      { key: 'adormir-tard', label: 'Em costa adormir-me perquè em connecto al llit' },
    ],
  },
  {
    id: 'academicSocial',
    title: 'Acadèmic/Social',
    items: [
      { key: 'notes-baixen', label: 'Han baixat notes o rendiment' },
      { key: 'conflictes-casa', label: 'Hi ha més conflictes a casa per l’ús' },
      { key: 'evito-amics', label: 'Quedo menys o evito activitats amb amics' },
    ],
  },
];

export default function WarningSigns(): React.ReactElement {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState<Record<FlagCategoryId, boolean>>({
    xarxes: true,
    videojocs: false,
    joc: false,
    estatAnim: false,
    son: false,
    academicSocial: false,
  });
  const [selected, setSelected] = useState<Record<FlagCategoryId, Set<string>>>({
    xarxes: new Set(),
    videojocs: new Set(),
    joc: new Set(),
    estatAnim: new Set(),
    son: new Set(),
    academicSocial: new Set(),
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const totals = useMemo(() => {
    const perCat: Record<FlagCategoryId, number> = {
      xarxes: selected.xarxes.size,
      videojocs: selected.videojocs.size,
      joc: selected.joc.size,
      estatAnim: selected.estatAnim.size,
      son: selected.son.size,
      academicSocial: selected.academicSocial.size,
    };
    const total = Object.values(perCat).reduce((a, b) => a + b, 0);
    const level = total >= 7 ? 'alt' : total >= 4 ? 'moderat' : total >= 1 ? 'baix' : 'cap';
    return { perCat, total, level };
  }, [selected]);

  function toggle(catId: FlagCategoryId, key: string) {
    setSelected((prev) => {
      const copy = new Set(prev[catId]);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return { ...prev, [catId]: copy };
    });
  }

  const suggestions = useMemo(() => {
    const s: string[] = [];
    if (selected.xarxes.size > 0) {
      s.push('Defineix franges “screen-free” (àpats, 1h abans de dormir) i desactiva notificacions no essencials.');
    }
    if (selected.videojocs.size > 0) {
      s.push('Posa temporitzadors visibles i pactats. Substitueix sessions llargues per partides curtes + activitat alternativa.');
    }
    if (selected.joc.size > 0) {
      s.push('Bloqueja mètodes de pagament, estableix límits clars i demana suport a un adult/professional.');
    }
    if (selected.estatAnim.size > 0) {
      s.push('Practica respiració 4-6 i etiqueta emocions abans d’obrir una app/joc.');
    }
    if (selected.son.size > 0) {
      s.push('Cap pantalla 60’ abans d’anar a dormir; deixa el mòbil fora de l’habitació.');
    }
    if (selected.academicSocial.size > 0) {
      s.push('Reserva espais setmanals per amistats/activitats sense pantalles i planifica tasques acadèmiques amb blocs de focus.');
    }
    return s;
  }, [selected]);

  async function handleSave() {
    if (!currentUser) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      const selectedList: { category: FlagCategoryId; key: string }[] = [];
      (Object.keys(selected) as FlagCategoryId[]).forEach((cat) => {
        selected[cat].forEach((k) => selectedList.push({ category: cat, key: k }));
      });
      await saveScreeningResult(currentUser.uid, {
        countsByCategory: totals.perCat,
        total: totals.total,
        level: totals.level as 'baix' | 'moderat' | 'alt' | 'cap',
        selected: selectedList,
      });
      setSavedMsg('Resultat desat al teu perfil ✅');
    } catch (e) {
      console.error(e);
      setSavedMsg('No s’ha pogut desar. Torna-ho a provar.');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(null), 3500);
    }
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-1 text-lg font-semibold text-brand-dark">Senyals d’alerta</h3>
      <p className="mb-3 text-sm text-gray-600">
        Marca els punts que et sonen. Et donarem un resum de risc i consells pràctics.
      </p>

      {/* Resultat ràpid */}
      <div className="mb-4 rounded-md border bg-gray-50 p-3 text-sm">
        <div><strong>Total marcat:</strong> {totals.total}</div>
        <div>
          <strong>Nivell de risc:</strong>{' '}
          <span
            className={
              totals.level === 'alt'
                ? 'text-red-600 font-semibold'
                : totals.level === 'moderat'
                ? 'text-amber-600 font-semibold'
                : totals.level === 'baix'
                ? 'text-emerald-700 font-semibold'
                : 'text-gray-700'
            }
          >
            {totals.level === 'cap' ? 'cap' : totals.level}
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <fieldset key={cat.id} className="rounded-lg border p-3">
            <legend className="flex items-center justify-between px-1">
              <button
                type="button"
                className="text-left font-medium text-brand-dark hover:underline"
                aria-expanded={open[cat.id]}
                onClick={() => setOpen((o) => ({ ...o, [cat.id]: !o[cat.id] }))}
              >
                {cat.title}
              </button>
              <span className="text-xs text-gray-500">{selected[cat.id].size} marcats</span>
            </legend>

            {open[cat.id] && (
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {cat.items.map((it) => {
                  const id = `${cat.id}-${it.key}`;
                  const checked = selected[cat.id].has(it.key);
                  return (
                    <div key={id} className="flex items-start gap-2 rounded-md bg-gray-50 p-2">
                      <input
                        id={id}
                        type="checkbox"
                        className="mt-1 h-4 w-4"
                        checked={checked}
                        onChange={() => toggle(cat.id, it.key)}
                      />
                      <label htmlFor={id} className="text-sm text-gray-800">
                        {it.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {/* Consells */}
      {totals.total > 0 && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <h4 className="font-semibold text-emerald-900">Consells suggerits</h4>
          <ul className="mt-1 list-disc pl-5 text-sm text-emerald-900">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || totals.total === 0 || !currentUser}
          className="rounded-lg bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-secondary disabled:bg-gray-400"
        >
          {saving ? 'Desant…' : 'Desar resultat'}
        </button>
        {savedMsg && <span className="text-sm text-gray-700">{savedMsg}</span>}
      </div>
    </section>
  );
}
