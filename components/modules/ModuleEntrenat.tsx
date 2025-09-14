// components/modules/ModuleEntrenat.tsx
import React, { useState } from 'react';

// Panell d'activitats (Cartes d'Emocions, Dilemes, Roleplay ramificat, Diari)
import ActivitiesHub from '../activities/ActivitiesHub';

// Roleplay “clàssic” amb escenaris (si ja el feies servir)
import SocialSkillsLab from '../skills/SocialSkillsLab';

// Assistent breu amb Gemini per consultes ràpides
import GeminiAssistant from '../skills/GeminiAssistant';

type TabKey = 'activitats' | 'roleplay' | 'assistent';

const TABS: { key: TabKey; label: string; desc: string }[] = [
  { key: 'activitats', label: "Activitats", desc: "Jocs i exercicis interactius" },
  { key: 'roleplay', label: "Roleplay guiada", desc: "Escenaris de conversa amb IA" },
  { key: 'assistent', label: "Assistent", desc: "Consultes ràpides amb IA" },
];

export default function ModuleEntrenat(): React.ReactElement {
  const [tab, setTab] = useState<TabKey>('activitats');

  return (
    <section className="animate-fade-in" aria-labelledby="entrenat-title">
      <div className="mb-6">
        <h2 id="entrenat-title" className="text-2xl font-bold text-brand-dark">
          Entrena&apos;t
        </h2>
        <p id="entrenat-desc" className="text-gray-600 mt-1">
          Millora habilitats socials i la gestió emocional amb activitats pràctiques i converses guiades.
        </p>
      </div>

      {/* Pestanyes accessibles */}
      <div role="tablist" aria-label="Seccions d'entrenament" className="mb-4 grid grid-cols-3 gap-2">
        {TABS.map(({ key, label, desc }) => {
          const isActive = tab === key;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${key}`}
              id={`tab-${key}`}
              onClick={() => setTab(key)}
              className={`w-full rounded-lg px-3 py-2 text-sm font-semibold border transition-colors
                ${isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-brand-dark border-gray-300 hover:bg-gray-50'}`}
            >
              <span className="block">{label}</span>
              <span className="block text-xs font-normal opacity-80">{desc}</span>
            </button>
          );
        })}
      </div>

      {/* PANELL: Activitats */}
      {tab === 'activitats' && (
        <div
          role="tabpanel"
          id="panel-activitats"
          aria-labelledby="tab-activitats"
          className="rounded-lg bg-white p-4 shadow-md"
        >
          {/* ActivitiesHub ja inclou: EmotionCards, SocialDilemmas, RoleplayLab, ReflectionJournal */}
          <ActivitiesHub />
        </div>
      )}

      {/* PANELL: Roleplay guiada (escenaris predefinits amb Firestore history) */}
      {tab === 'roleplay' && (
        <div
          role="tabpanel"
          id="panel-roleplay"
          aria-labelledby="tab-roleplay"
          className="rounded-lg bg-white p-4 shadow-md"
        >
          <SocialSkillsLab />
        </div>
      )}

      {/* PANELL: Assistent curt amb Gemini */}
      {tab === 'assistent' && (
        <div
          role="tabpanel"
          id="panel-assistent"
          aria-labelledby="tab-assistent"
          className="rounded-lg bg-white p-4 shadow-md"
        >
          <GeminiAssistant />
        </div>
      )}
    </section>
  );
}
