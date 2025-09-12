import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
    onToggleView: () => void;
}

export default function LoginScreen({ onToggleView }: LoginScreenProps): React.ReactElement {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || "Error en iniciar sessió.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 animate-fade-in">
            <h1 className="text-3xl font-bold text-center text-brand-dark mb-2">Benvingut/da de nou!</h1>
            <p className="text-center text-gray-600 mb-8">Inicia sessió per continuar.</p>
            
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Correu Electrònic</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Contrasenya</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                </div>
                 <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg mt-4 hover:bg-blue-600 transition-colors disabled:bg-gray-400">
                    {loading ? 'Iniciant sessió...' : 'Inicia Sessió'}
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-6">
                No tens un compte?{' '}
                <button onClick={onToggleView} className="font-semibold text-brand-primary hover:underline">Registra't</button>
            </p>
        </div>
    );
}