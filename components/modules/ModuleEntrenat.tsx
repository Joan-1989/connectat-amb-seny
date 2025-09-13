import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';
import type { Mood, MoodEntry, WellbeingPlan, RecoveryRudderEntry, RecoveryDomain } from '../../types';
import SocialSkillsLab from '../skills/SocialSkillsLab';
import { generateWellbeingPlan } from '../../services/geminiService';
import { db } from '../../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// --- Components ---

const Confetti: React.FC = () => (
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

const DigitalDetox: React.FC = () => {
    const { addBadge, earnedBadges } = useGamification();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const timerRef = useRef<number | null>(null);
    const challengeTime = 60;

    useEffect(() => {
        if (isActive && secondsLeft > 0) {
            timerRef.current = window.setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
        } else if (secondsLeft === 0 && isActive) {
            setIsActive(false);
            setIsCompleted(true);
            if (!earnedBadges.includes('detox-bronze')) addBadge('detox-bronze');
        }
        return () => { if(timerRef.current) clearTimeout(timerRef.current); };
    }, [isActive, secondsLeft, addBadge, earnedBadges]);

    const startTimer = () => {
        setSecondsLeft(challengeTime);
        setIsActive(true);
        setIsCompleted(false);
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md relative">
            {isCompleted && <Confetti />}
            <h3 className="text-xl font-bold text-brand-dark mb-4">Repte: Detox Digital (Bronze)</h3>
            <p className="text-gray-600 mb-4">Objectiu: 1 minut sense distraccions del mòbil.</p>
            <div className="text-center bg-gray-100 p-4 rounded-lg my-4">
                <p className="text-5xl font-mono font-bold text-brand-primary">{formatTime(secondsLeft)}</p>
            </div>
            {!isActive && !isCompleted && <button onClick={startTimer} className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Comença!</button>}
            {isActive && <p className="text-center text-brand-secondary font-semibold">Repte en marxa!</p>}
            {isCompleted && <div className="text-center text-green-600 font-semibold"><p className="text-2xl">Repte completat! 🎉</p><p>Has guanyat la insígnia "Inici del Detox".</p></div>}
        </div>
    );
};

const WellbeingAssessment: React.FC<{ onComplete: (plan: WellbeingPlan) => void }> = ({ onComplete }) => {
    const { currentUser } = useAuth();
    const { addBadge } = useGamification();
    const [answers, setAnswers] = useState<string[]>(Array(5).fill(''));
    const [loading, setLoading] = useState(false);

    const questions = [
        "Com gestiones el temps que passes a les xarxes socials?",
        "Sents que necessites estar connectat/da constantment?",
        "Com et sents després de passar molt de temps online?",
        "Tens hàbits saludables de son (deixar el mòbil, etc.)?",
        "Què fas per desconnectar de la tecnologia?",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || answers.some(a => a.trim() === '')) return;
        setLoading(true);
        const { consells, reptes } = await generateWellbeingPlan(answers);
        const newPlan: WellbeingPlan = { answers, consejos: consells, reptes, createdAt: new Date().toISOString() };
        await setDoc(doc(db, 'wellbeingPlans', currentUser.uid), newPlan);
        addBadge('wellbeing-plan-created');
        onComplete(newPlan);
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Crea el teu Pla de Benestar Digital</h3>
            <p className="text-gray-600 mb-6">Respon a aquestes preguntes per generar un pla personalitzat.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {questions.map((q, i) => (
                    <div key={i}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{q}</label>
                        <textarea value={answers[i]} onChange={(e) => setAnswers(prev => { const newAns = [...prev]; newAns[i] = e.target.value; return newAns; })} rows={2} className="w-full p-2 border rounded" />
                    </div>
                ))}
                <button type="submit" disabled={loading} className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-lg">{loading ? "Generant..." : "Genera el Pla"}</button>
            </form>
        </div>
    );
};

const WellbeingPlanDisplay: React.FC<{ plan: WellbeingPlan, onReset: () => void }> = ({ plan, onReset }) => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
        <h3 className="text-xl font-bold text-brand-dark mb-4">El teu Pla de Benestar Digital ✨</h3>
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-brand-primary">Consells Personalitzats</h4>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700">{plan.consejos.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
            <div>
                <h4 className="font-bold text-brand-secondary">Reptes Setmanals</h4>
                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700">{plan.reptes.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
        </div>
        <button onClick={onReset} className="w-full mt-6 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg">Crear un nou pla</button>
    </div>
);

const RecoveryRudder: React.FC = () => {
    const { currentUser } = useAuth();
    const { addBadge, earnedBadges } = useGamification();
    const [scores, setScores] = useState<Record<RecoveryDomain, number>>({ esperanca: 1, connexio: 1, identitat: 1, sentit: 1, apoderament: 1, benestar: 1, vida_social: 1, inclusio: 1 });
    const [loading, setLoading] = useState(true);

    const domains: { id: RecoveryDomain, label: string }[] = [
        { id: 'esperanca', label: 'Esperança' }, { id: 'connexio', label: 'Connexió' }, { id: 'identitat', label: 'Identitat' }, { id: 'sentit', label: 'Sentit a la vida' },
        { id: 'apoderament', label: 'Apoderament' }, { id: 'benestar', label: 'Benestar Físic' }, { id: 'vida_social', label: 'Vida Social' }, { id: 'inclusio', label: 'Inclusió' }
    ];

    useEffect(() => {
        const fetchLastEntry = async () => {
            if (!currentUser) { setLoading(false); return; }
            const entryRef = doc(db, 'recoveryRudder', currentUser.uid);
            const docSnap = await getDoc(entryRef);
            if (docSnap.exists()) setScores(docSnap.data().lastEntry.scores);
            setLoading(false);
        };
        fetchLastEntry();
    }, [currentUser]);

    const handleSave = async () => {
        if (!currentUser) return;
        const newEntry: RecoveryRudderEntry = { date: new Date().toISOString(), scores };
        await setDoc(doc(db, 'recoveryRudder', currentUser.uid), { lastEntry: newEntry });
        if (!earnedBadges.includes('first-rudder-entry')) addBadge('first-rudder-entry');
        alert("El teu progrés s'ha guardat correctament!");
    };
    
    if (loading) return <p>Carregant el Timó...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-brand-dark mb-4">El Timó de la Recuperació</h3>
            <p className="text-gray-600 mb-6">Puntua de 1 (gens satisfet/a) a 5 (molt satisfet/a) com et sents en cada àrea de la teva vida ara mateix.</p>
            <div className="space-y-4">
                {domains.map(({ id, label }) => (
                    <div key={id}>
                        <label className="block font-semibold text-gray-700">{label}</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <span>1</span>
                            <input type="range" min="1" max="5" value={scores[id]} onChange={e => setScores(prev => ({...prev, [id]: parseInt(e.target.value)}))} className="w-full" />
                            <span>5</span>
                            <span className="font-bold text-brand-primary w-6 text-center">{scores[id]}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleSave} className="w-full mt-8 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Guarda el Progrés</button>
        </div>
    );
};

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
    const [wellbeingPlan, setWellbeingPlan] = useState<WellbeingPlan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);
    const { currentUser } = useAuth();
    const { earnedBadges } = useGamification();

    useEffect(() => {
        if (!currentUser) { setLoadingPlan(false); return; }
        const fetchPlan = async () => {
            const planRef = doc(db, 'wellbeingPlans', currentUser.uid);
            const planSnap = await getDoc(planRef);
            if (planSnap.exists()) setWellbeingPlan(planSnap.data() as WellbeingPlan);
            setLoadingPlan(false);
        };
        fetchPlan();
    }, [currentUser]);
    
    const renderContent = () => {
        if (activeSubModule) {
             return (
                 <div className="animate-fade-in">
                    <button onClick={() => setActiveSubModule(null)} className="mb-4 text-brand-primary font-bold">&larr; Tornar al Dashboard</button>
                    {activeSubModule === 'detox' && <DigitalDetox />}
                    {activeSubModule === 'wellbeing' && (loadingPlan ? <p>Carregant...</p> : wellbeingPlan ? <WellbeingPlanDisplay plan={wellbeingPlan} onReset={() => setWellbeingPlan(null)} /> : <WellbeingAssessment onComplete={setWellbeingPlan} />)}
                    {activeSubModule === 'lab' && <SocialSkillsLab />}
                    {activeSubModule === 'rudder' && <RecoveryRudder />}
                </div>
             );
        }

        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-2 text-brand-dark">Entrena't: Eines per créixer</h2>
                <div className="bg-blue-100 border-l-4 border-brand-primary text-blue-700 p-4 rounded-md mb-6">
                    <p className="font-bold">El teu progrés</p>
                    <p>Has aconseguit {earnedBadges.length} insígnies. Continua així!</p>
                </div>
                <div className="space-y-4">
                    <SubModuleCard title="El Timó de la Recuperació" description="Avalua el teu moment vital actual." icon="🧭" onClick={() => setActiveSubModule('rudder')} />
                    <SubModuleCard title="Pla de Benestar Digital" description="Crea un pla personalitzat amb IA." icon="🌿" onClick={() => setActiveSubModule('wellbeing')} />
                    <SubModuleCard title="Laboratori d'Habilitats Socials" description="Practica converses en un entorn segur." icon="💬" onClick={() => setActiveSubModule('lab')} />
                    <SubModuleCard title="Detox Digital" description="Completa reptes de desconnexió." icon="🔌" onClick={() => setActiveSubModule('detox')} />
                </div>
            </div>
        );
    }
    return renderContent();
}

