// components/activities/ActivitiesHub.tsx
import React, { useState } from 'react';
import EmotionCards from './EmotionCards';
import RoleplayLab from './RoleplayLab';
import SocialDilemmas from './SocialDilemmas';
import ReflectionJournal from './ReflectionJournal';

type Tab = 'cartes' | 'roleplay' | 'dilemes' | 'diari';

export default function ActivitiesHub(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('cartes');

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-brand-dark">Laboratori Interactiu</h2>
      <p className="mb-6 text-gray-600">Entrena gestió emocional i habilitats socials.</p>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('cartes')}   className={`px-3 py-2 rounded ${tab==='cartes'?'bg-brand-primary text-white':'bg-gray-100'}`}>🃏 Cartes</button>
        <button onClick={() => setTab('roleplay')} className={`px-3 py-2 rounded ${tab==='roleplay'?'bg-brand-primary text-white':'bg-gray-100'}`}>🎭 Roleplay</button>
        <button onClick={() => setTab('dilemes')}  className={`px-3 py-2 rounded ${tab==='dilemes'?'bg-brand-primary text-white':'bg-gray-100'}`}>🤔 Dilemes</button>
        <button onClick={() => setTab('diari')}    className={`px-3 py-2 rounded ${tab==='diari'?'bg-brand-primary text-white':'bg-gray-100'}`}>📝 Diari</button>
      </div>

      {tab === 'cartes'   && <EmotionCards />}
      {tab === 'roleplay' && <RoleplayLab />}
      {tab === 'dilemes'  && <SocialDilemmas />}
      {tab === 'diari'    && <ReflectionJournal />}
    </div>
  );
}
