import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileSelector from '@/components/ProfileSelector';
import type { UserProfile } from '@/types';

interface RegisterScreenProps {
    onToggleView: () => void;
}

export default function RegisterScreen({ onToggleView }: RegisterScreenProps): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) {
            setError("Si us plau, selecciona un perfil.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Les contrasenyes no coincideixen.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register(email, password, profile);
        } catch (err: any) {
            setError(err.message || "Error en el registre.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleProfileSelection = (profileData: UserProfile, age?: number) => {
        const finalProfile: UserProfile = { ...profileData };
        if (age !== undefined) {
            finalProfile.age = age;
        }
        setProfile(finalProfile);
    };

    if (!profile) {
        return <ProfileSelector onProfileSelect={handleProfileSelection} />;
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
            <button onClick={() => setProfile(null)} className="mb-4 text-brand-primary font-semibold">&larr; Canviar perfil</button>
            <h1 className="text-3xl font-bold text-center text-brand-dark mb-2">Crea el teu compte</h1>
            <p className="text-center text-gray-600 mb-8">Perfil seleccionat: <span className="font-bold">{profile.type}</span></p>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            
            <form onSubmit={handleRegister} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Correu Electrònic</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Contrasenya</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Confirma la contrasenya</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                    {loading ? 'Registrant...' : 'Registra\'t'}
                </button>
            </form>
             <p className="text-center text-sm text-gray-600 mt-6">
                Ja tens un compte?{' '}
                <button onClick={onToggleView} className="font-semibold text-brand-primary hover:underline">Inicia Sessió</button>
            </p>
        </div>
    );
}