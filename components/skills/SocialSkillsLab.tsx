import React, { useState } from 'react';
import type { ChatScenario } from '../../types';
import { chatScenarios } from '../../data/chatScenarios';
import InteractiveChat from './InteractiveChat';

// 🔽 Import del nou Hub
import ActivitiesHub from '@/components/activities/ActivitiesHub';

type Tab = 'escenaris' | 'laboratori';

export default function SocialSkillsLab(): React.ReactElement {
  const [selectedScenario, setSelectedScenario] = useState<ChatScenario | null>(null);
  const [tab, setTab] = useState<Tab>('escenaris');

  // 🔹 Si hi ha escenari seleccionat → mostra directament el xat interactiu
  if (selectedScenario) {
    return (
      <InteractiveChat
        scenario={selectedScenario}
        onBack={() => setSelectedScenario(null)}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-brand-dark">
        Laboratori d'Habilitats Socials
      </h2>
      <p className="mb-6 text-gray-600">
        Entrena habilitats socials i gestió emocional a través de converses i activitats interactives.
      </p>

      {/* 🔹 Pestanyes */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('escenaris')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            tab === 'escenaris'
              ? 'bg-brand-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          💬 Escenaris de Xat
        </button>
        <button
          onClick={() => setTab('laboratori')}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            tab === 'laboratori'
              ? 'bg-brand-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🧩 Laboratori Interactiu
        </button>
      </div>

      {/* 🔹 Contingut segons la pestanya */}
      {tab === 'escenaris' && (
        <div className="space-y-4">
          {chatScenarios.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-200 flex items-center space-x-4"
            >
              <span className="text-4xl">{sc.icon}</span>
              <div>
                <h3 className="font-bold text-brand-dark">{sc.title}</h3>
                <p className="text-sm text-gray-600">{sc.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'laboratori' && <ActivitiesHub />}
    </div>
  );
}
