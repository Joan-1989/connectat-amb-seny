// components/modules/ModuleEntrenat.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

import WarningSigns from '../activities/WarningSigns';
import EmotionCards from '../activities/EmotionCards';
import RoleplayLab from '../activities/RoleplayLab';
import SocialSkillsLab from '../skills/SocialSkillsLab';
import GeminiAssistant from '../skills/GeminiAssistant';
import ReflectionJournal from '../activities/ReflectionJournal';
import SocialDilemmas from '../activities/SocialDilemmas';

type TabKey =
  | 'screening'
  | 'emotion'
  | 'roleplay'
  | 'social'
  | 'assistant'
  | 'journal'
  | 'dilemmas';

type Tab = {
  key: TabKey;
  label: string;
  description: string;
  render: () => React.ReactNode;
  emoji: string;
};

export default function ModuleEntrenat(): React.ReactElement {
  const tabs: Tab[] = useMemo(
    () => [
      {
        key: 'screening',
        label: 'Senyals d’alerta',
        emoji: '🧭',
        description: 'Checklist guiat per detectar riscos i fer seguiment al teu perfil.',
        render: () => <WarningSigns />,
      },
      {
        key: 'emotion',
        label: 'Cartes d’emocions',
        emoji: '🎴',
        description:
          'Arrossega situacions a estratègies (respiració, pausa, parlar-ho…) i aprèn respostes.',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Cartes d’emocions</h3>
            <p className="mb-4 text-sm text-gray-600">
              Arrossega cada targeta a la resposta que millor encaixa. Es desa la sessió al teu perfil.
            </p>
            <EmotionCards />
          </section>
        ),
      },
      {
        key: 'roleplay',
        label: 'Roleplay',
        emoji: '🗣️',
        description:
          'Practica com dir “no”, posar límits i resoldre conflictes en converses ramificades.',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Roleplay ramificat</h3>
            <p className="mb-4 text-sm text-gray-600">
              Explora opcions i rep feedback. Els passos es registren a la teva sessió.
            </p>
            <RoleplayLab />
          </section>
        ),
      },
      {
        key: 'social',
        label: 'Xats de rol',
        emoji: '💬',
        description:
          'Simula converses reals (habilitats socials): peticions difícils, crítiques, límits…',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Xats de rol</h3>
            <p className="mb-4 text-sm text-gray-600">
              Escenaris pràctics per entrenar l’assertivitat i l’empatia.
            </p>
            <SocialSkillsLab />
          </section>
        ),
      },
      {
        key: 'assistant',
        label: 'Assistent',
        emoji: '🤖',
        description: 'Parla amb l’assistent (Gemini) en català i rep consells breus i concrets.',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Assistent d’acompanyament</h3>
            <p className="mb-4 text-sm text-gray-600">
              Conversa guiada per entendre com et sents i com actuar de manera saludable.
            </p>
            <GeminiAssistant />
          </section>
        ),
      },
      {
        key: 'journal',
        label: 'Diari',
        emoji: '📓',
        description: 'Escriu com estàs i rep un feedback curt i amable. Es desa al teu perfil.',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Diari de reflexió</h3>
            <p className="mb-4 text-sm text-gray-600">
              Escriu lliurement i deixa que l’app et suggereixi punts de millora.
            </p>
            <ReflectionJournal />
          </section>
        ),
      },
      {
        key: 'dilemmas',
        label: 'Dilemes',
        emoji: '⚖️',
        description:
          'Tria entre opcions difícils i obtén pros/contres i una alternativa assertiva.',
        render: () => (
          <section className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 text-lg font-semibold text-brand-dark">Dilemes socials</h3>
            <p className="mb-4 text-sm text-gray-600">
              Analitza decisions amb calma i entrena la satisfacció diferida.
            </p>
            <SocialDilemmas />
          </section>
        ),
      },
    ],
    []
  );

  // estat de pestanya activa
  const [active, setActive] = useState<TabKey>('screening');

  // Suport hash per enllaços directes (p. ex. #entrenat=roleplay)
  useEffect(() => {
    const h = window.location.hash;
    const m = h.match(/entrenat=([a-z-]+)/i);
    if (m) {
      const key = m[1] as TabKey;
      if (tabs.find(t => t.key === key)) setActive(key);
    }
    // escolta canvis de hash
    const onHash = () => {
      const h2 = window.location.hash;
      const m2 = h2.match(/entrenat=([a-z-]+)/i);
      if (m2) {
        const key2 = m2[1] as TabKey;
        if (tabs.find(t => t.key === key2)) setActive(key2);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [tabs]);

  const handleGo = (key: TabKey) => {
    setActive(key);
    // actualitza hash perquè puguem compartir enllaç
    window.location.hash = `entrenat=${key}`;
    // focus al panell per a11y
    setTimeout(() => {
      const panel = document.getElementById(`panel-${key}`);
      panel?.focus();
    }, 0);
  };

  // refs per navegació amb fletxes al tablist
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    screening: null,
    emotion: null,
    roleplay: null,
    social: null,
    assistant: null,
    journal: null,
    dilemmas: null,
  });

  const onTabsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const order = tabs.map(t => t.key);
    const idx = order.indexOf(active);
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % order.length;
    if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + order.length) % order.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = order.length - 1;
    const nextKey = order[nextIdx];
    tabRefs.current[nextKey]?.focus();
    handleGo(nextKey);
  };

  const activeTab = tabs.find(t => t.key === active)!;

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark">Entrena&apos;t</h2>
      <p className="text-sm text-gray-600">
        Tria una eina i entrena habilitats emocionals i socials amb experiències interactives.
      </p>

      {/* Accés ràpid (tiles) */}
      <section aria-labelledby="quick-nav-title">
        <h3 id="quick-nav-title" className="sr-only">Accés ràpid a activitats</h3>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {tabs.map(t => (
            <article key={t.key} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
                <h4 className="font-semibold text-brand-dark">{t.label}</h4>
              </div>
              <p className="mt-1 text-sm text-gray-600">{t.description}</p>
              <button
                type="button"
                onClick={() => handleGo(t.key)}
                className="mt-3 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Obrir pestanya: ${t.label}`}
              >
                Obrir
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Subnavegació sticky amb pestanyes accessibles */}
      <div
        className="sticky top-16 z-10 rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm"
        role="tablist"
        aria-label="Pestanyes d'activitats"
        onKeyDown={onTabsKeyDown}
      >
        <div className="flex snap-x overflow-x-auto p-2">
          {tabs.map(t => {
            const selected = t.key === active;
            return (
              <button
                key={t.key}
                ref={el => (tabRefs.current[t.key] = el)}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.key}`}
                id={`tab-${t.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => handleGo(t.key)}
                className={`mr-2 inline-flex snap-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                  ${selected ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span aria-hidden="true">{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panell actiu (només es mostra un a la vegada) */}
      <div
        id={`panel-${activeTab.key}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.key}`}
        tabIndex={-1}
        className="outline-none"
      >
        {activeTab.render()}
      </div>
    </div>
  );
}
