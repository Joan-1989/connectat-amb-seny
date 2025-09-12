import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../../context/GamificationContext';
import type { Mood, MoodEntry } from '../../types';
import SocialSkillsLab from '../skills/SocialSkillsLab';

// Simple Confetti component
const Confetti: React.FC = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animation: `confetti-fall ${1 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
                        width: `${Math.floor(Math.random() * (10 - 5 + 1)) + 5}px`,
                        height: `${Math.floor(Math.random() * (10 - 5 + 1)) + 5}px`,
                        backgroundColor: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'][Math.floor(Math.random() * 4)],
                        opacity: Math.random()
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh); }
                    100% { transform: translateY(110vh) rotate(${Math.random() * 360}deg); }
                }
            `}</style>
        </div>
    );
};

const DigitalDetox: React.FC = () => {
    const { addBadge, earnedBadges } = useGamification();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    // FIX: Changed NodeJS.Timeout to number, as setTimeout in browser environments returns a number.
    const timerRef = useRef<number | null>(null);

    const challengeTime = 60; // 60 seconds for demo

    useEffect(() => {
        if (isActive && secondsLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setSecondsLeft(secondsLeft - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isActive) {
            setIsActive(false);
            setIsCompleted(true);
            if (!earnedBadges.includes('detox-bronze')) {
                addBadge('detox-bronze');
            }
        }
        return () => {
            if(timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive, secondsLeft, addBadge, earnedBadges]);

    const startTimer = () => {
        setSecondsLeft(challengeTime);
        setIsActive(true);
        setIsCompleted(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            {isCompleted && <Confetti />}
            <h3 className="text-xl font-bold text-brand-dark mb-4">Repte: Detox Digital (Bronze)</h3>
            <p className="text-gray-600 mb-4">Objectiu: 1 minut sense distraccions del mòbil.</p>
            
            <div className="text-center bg-gray-100 p-4 rounded-lg my-4">
                <p className="text-5xl font-mono font-bold text-brand-primary">{formatTime(secondsLeft)}</p>
            </div>
            
            {!isActive && !isCompleted && (
                <button onClick={startTimer} className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Comença el repte!</button>
            )}
            {isActive && (
                <p className="text-center text-brand-secondary font-semibold">Repte en marxa! Concentra't.</p>
            )}
            {isCompleted && (
                <div className="text-center text-green-600 font-semibold">
                    <p className="text-2xl">Repte completat! 🎉</p>
                    <p>Has guanyat la insígnia "Inici del Detox".</p>
                </div>
            )}
        </div>
    );
};

const EmotionalDiary: React.FC = () => {
    const { addBadge, earnedBadges } = useGamification();
    const [entry, setEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [entries, setEntries] = useState<MoodEntry[]>([]);

    const moods: { mood: Mood; emoji: string }[] = [
        { mood: 'Feliç', emoji: '😊' }, { mood: 'Normal', emoji: '😐' }, { mood: 'Trist', emoji: '😢' },
        { mood: 'Enfadat', emoji: '😠' }, { mood: 'Ansiós', emoji: '😟' }, { mood: 'Relaxat', emoji: '😌' }
    ];

    const handleSave = () => {
        if (!entry.trim() || !selectedMood) {
            alert("Si us plau, escriu alguna cosa i selecciona una emoció.");
            return;
        }
        const newEntry = {
            date: new Date().toLocaleString('ca-ES'),
            text: entry,
            mood: selectedMood,
        };
        setEntries([newEntry, ...entries]);
        setEntry('');
        setSelectedMood(null);

        if (!earnedBadges.includes('first-diary')) {
            addBadge('first-diary');
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Diari Emocional Intel·ligent</h3>
            <textarea value={entry} onChange={e => setEntry(e.target.value)} rows={4} className="w-full border rounded p-2 mb-2" placeholder="Com et sents avui?"></textarea>
            
            <div className="my-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Com et sents ara mateix?</p>
                <div className="flex justify-around">
                    {moods.map(({mood, emoji}) => (
                         <button key={mood} onClick={() => setSelectedMood(mood)} className={`text-3xl p-2 rounded-full transition-transform transform hover:scale-125 ${selectedMood === mood ? 'bg-blue-200 ring-2 ring-brand-primary' : ''}`}>
                            {emoji}
                         </button>
                    ))}
                </div>
            </div>

            <button onClick={handleSave} className="w-full bg-brand-secondary text-brand-dark font-bold py-2 px-4 rounded-lg">Desa l'entrada</button>
        
            <div className="mt-6">
                <h4 className="font-bold mb-2">Entrades anteriors:</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                    {entries.length > 0 ? entries.map((e, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded flex items-start">
                            <span className="text-2xl mr-3">{moods.find(m => m.mood === e.mood)?.emoji}</span>
                            <div>
                                <p className="text-xs text-gray-500">{e.date}</p>
                                <p>{e.text}</p>
                            </div>
                        </div>
                    )) : <p className="text-sm text-gray-500">Encara no hi ha entrades.</p>}
                </div>
            </div>
        </div>
    )
};

const EmotionWheel = () => {
    const [selectedEmotion, setSelectedEmotion] = useState<{name: string, color: string, tip: string} | null>(null);
    const emotions = [
        { name: 'Alegria', color: 'bg-yellow-300', tip: "Comparteix-la! Parla amb un amic sobre què t'ha fet sentir així." },
        { name: 'Tristesa', color: 'bg-blue-400', tip: "Permet-te sentir-la. Escolta música tranquil·la o escriu al teu diari." },
        { name: 'Ràbia', color: 'bg-red-400', tip: "Canalitza l'energia. Fes una activitat física o practica la respiració profunda." },
        { name: 'Por', color: 'bg-purple-400', tip: "Racionalitza-la. Pregunta't: 'Què és el pitjor que podria passar?' Parla amb algú de confiança." },
        { name: ' calma', color: 'bg-green-300', tip: "Gaudeix del moment. Una petita meditació o un passeig poden allargar aquesta sensació." },
    ];
    return (
         <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Roda de les Emocions</h3>
            <p className="text-gray-600 mb-4">Toca una emoció per aprendre a gestionar-la.</p>
            <div className="flex flex-wrap justify-center gap-4">
                {emotions.map(e => (
                    <button key={e.name} onClick={() => setSelectedEmotion(e)} className={`w-32 h-20 ${e.color} rounded-lg font-bold text-white shadow-md flex items-center justify-center text-center hover:scale-105 transition-transform`}>
                        {e.name}
                    </button>
                ))}
            </div>
            {selectedEmotion && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg animate-fade-in">
                    <h4 className={`font-bold text-lg ${selectedEmotion.color.replace('bg-', 'text-').replace('-300', '-600').replace('-400', '-700')}`}>{selectedEmotion.name}</h4>
                    <p className="text-gray-700">{selectedEmotion.tip}</p>
                </div>
            )}
        </div>
    )
}

const SubModuleCard: React.FC<{ title: string; description: string; onClick: () => void; icon: string; }> = ({ title, description, onClick, icon }) => (
    <div onClick={onClick} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-200">
        <div className="flex items-center space-x-4">
             <span className="text-3xl">{icon}</span>
            <div>
                <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
                <p className="text-gray-600 mt-1 text-sm">{description}</p>
            </div>
        </div>
    </div>
);


export default function ModuleEntrenat(): React.ReactElement {
    const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
    const { earnedBadges } = useGamification();

    const renderContent = () => {
        if (activeSubModule) {
             return (
                 <div className="animate-fade-in">
                    <button onClick={() => setActiveSubModule(null)} className="mb-4 text-brand-primary font-bold">&larr; Tornar al Dashboard</button>
                    {activeSubModule === 'detox' && <DigitalDetox />}
                    {activeSubModule === 'diary' && <EmotionalDiary />}
                    {activeSubModule === 'wheel' && <EmotionWheel />}
                    {activeSubModule === 'lab' && <SocialSkillsLab />}
                </div>
             );
        }

        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-2 text-brand-dark">Dashboard de Benestar</h2>
                <div className="bg-blue-100 border-l-4 border-brand-primary text-blue-700 p-4 rounded-md mb-6">
                    <p className="font-bold">El teu progrés</p>
                    <p>Has aconseguit {earnedBadges.length} insígnies. Continua així!</p>
                </div>

                <div className="space-y-4">
                    <SubModuleCard title="Detox Digital" description="Completa reptes de desconnexió." icon="🔌" onClick={() => setActiveSubModule('detox')} />
                    <SubModuleCard title="Diari Emocional" description="Registra i entén les teves emocions." icon="✍️" onClick={() => setActiveSubModule('diary')} />
                    <SubModuleCard title="Roda de les Emocions" description="Aprèn a gestionar com et sents." icon="🎨" onClick={() => setActiveSubModule('wheel')} />
                    <SubModuleCard title="Laboratori d'Habilitats Socials" description="Practica converses en un entorn segur." icon="💬" onClick={() => setActiveSubModule('lab')} />
                </div>
            </div>
        )
    }

    return renderContent();
}