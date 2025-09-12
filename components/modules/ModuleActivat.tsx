import React, { useState } from 'react';
import { ProfileType } from '../../types';
import type { UserProfile } from '../../types';
import { generateConversationStarters } from '../../services/geminiService';

interface ModuleActivatProps {
  profile: UserProfile | null;
}

const EMERGENCY_CONTACTS = [
    { name: "Telèfon de l'Esperança", phone: "717 003 717" },
    { name: "Emergències", phone: "112" },
    { name: "Salut Respon", phone: "061" },
];

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 animate-fade-in">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full m-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Ajuda Immediata</h2>
            <p className="mb-4">Si et trobes en una situació de crisi, contacta amb un d'aquests números.</p>
            <div className="space-y-3">
                {EMERGENCY_CONTACTS.map(contact => (
                    <a key={contact.phone} href={`tel:${contact.phone}`} className="block w-full text-left bg-gray-100 p-3 rounded-lg hover:bg-gray-200">
                        <p className="font-bold">{contact.name}</p>
                        <p className="text-brand-primary">{contact.phone}</p>
                    </a>
                ))}
            </div>
            <button onClick={onClose} className="mt-6 w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Tancar</button>
        </div>
    </div>
);

const FamilyEducatorSpace = () => {
    const [starters, setStarters] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState<string>('seguretat online');
    
    const resources = {
        "Guies": [
            { title: "Guia sobre Ciberassetjament per a Pares", description: "Com detectar i actuar davant l'assetjament en línia.", url: "#" },
        ],
        "Tutorials": [
             { title: "Configurar Controls Parentals a iOS", description: "Pas a pas per a una configuració efectiva.", url: "#" },
        ],
        "Activitats": [
            { title: "Idees per a una Tarda Sense Pantalles", description: "Fomenta la connexió familiar offline.", url: "#" },
        ]
    };

    const forumChannels = ["#PrimersMòbils", "#Videojocs", "#Ciberassetjament", "#SalutMental"];

    const handleGenerate = async () => {
        setLoading(true);
        const generatedStarters = await generateConversationStarters(topic);
        setStarters(generatedStarters);
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8 space-y-8">
            <h3 className="text-xl font-bold text-brand-dark -mb-4">Espai per a Famílies i Educadors</h3>
            
            {/* Conversation Starters */}
            <section>
                <h4 className="font-bold text-lg mb-2 text-brand-primary">Iniciadors de Conversa</h4>
                <p className="mb-4 text-sm text-gray-600">Genera idees per iniciar converses importants amb els joves.</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Tema:</label>
                    <select value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 border rounded mt-1">
                        <option value="seguretat online">Seguretat Online</option>
                        <option value="ciberassetjament">Ciberassetjament</option>
                        <option value="salut mental">Salut Mental</option>
                        <option value="ús del mòbil">Ús del Mòbil</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-brand-accent text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                    {loading ? 'Generant...' : 'Genera Idees'}
                </button>

                {starters.length > 0 && (
                    <div className="mt-6 bg-amber-50 p-3 rounded-lg">
                        <h5 className="font-bold mb-2">Aquí tens algunes idees:</h5>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {starters.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                )}
            </section>

            {/* Resource Library */}
            <section>
                <h4 className="font-bold text-lg mb-2 text-brand-primary">Biblioteca de Recursos</h4>
                <div className="space-y-4">
                    {Object.entries(resources).map(([category, docs]) => (
                        <div key={category}>
                             <h5 className="font-semibold text-gray-700">{category}</h5>
                             {docs.map((doc, i) => (
                                 <a href={doc.url} target="_blank" rel="noopener noreferrer" key={i} className="block bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors mt-1">
                                    <p className="font-semibold text-brand-dark">{doc.title}</p>
                                    <p className="text-sm text-gray-600">{doc.description}</p>
                                </a>
                             ))}
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Forum Placeholder */}
            <section>
                <h4 className="font-bold text-lg mb-2 text-brand-primary">Fòrum de Discussió (Properament)</h4>
                 <p className="mb-4 text-sm text-gray-600">Un espai per compartir experiències i resoldre dubtes amb altres famílies i educadors.</p>
                 <div className="flex flex-wrap gap-2">
                    {forumChannels.map(channel => (
                        <span key={channel} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{channel}</span>
                    ))}
                 </div>
            </section>
        </div>
    );
};


export default function ModuleActivat({ profile }: ModuleActivatProps): React.ReactElement {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const isAdultProfile = profile?.type === ProfileType.Tutor || profile?.type === ProfileType.Professional;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-brand-dark">Activa't</h2>
      
      <button 
        onClick={() => setShowHelpModal(true)} 
        className="w-full bg-red-500 text-white font-bold py-4 px-4 rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 duration-300 text-lg"
      >
        Botó d'Ajuda Immediata
      </button>

      {isAdultProfile && <FamilyEducatorSpace />}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}