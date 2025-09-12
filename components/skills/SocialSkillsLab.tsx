import React, { useState } from 'react';
import type { ChatScenario } from '../../types';
import { chatScenarios } from '../../data/chatScenarios';
import InteractiveChat from './InteractiveChat';

const ScenarioCard: React.FC<{ scenario: ChatScenario; onSelect: () => void; }> = ({ scenario, onSelect }) => (
    <div onClick={onSelect} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-200 flex items-center space-x-4">
        <span className="text-4xl">{scenario.icon}</span>
        <div>
            <h3 className="font-bold text-brand-dark">{scenario.title}</h3>
            <p className="text-sm text-gray-600">{scenario.description}</p>
        </div>
    </div>
);


export default function SocialSkillsLab(): React.ReactElement {
    const [selectedScenario, setSelectedScenario] = useState<ChatScenario | null>(null);

    if (selectedScenario) {
        return <InteractiveChat scenario={selectedScenario} onBack={() => setSelectedScenario(null)} />;
    }

    return (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-brand-dark">Laboratori d'Habilitats Socials</h2>
            <p className="mb-6 text-gray-600">Tria un escenari per practicar una conversa. Un assistent d'IA jugarà un rol per ajudar-te a entrenar en un entorn segur.</p>
            <div className="space-y-4">
                {chatScenarios.map(sc => (
                    <ScenarioCard key={sc.id} scenario={sc} onSelect={() => setSelectedScenario(sc)} />
                ))}
            </div>
        </div>
    );
}