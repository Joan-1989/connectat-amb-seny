// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onToggleView: () => void;
}

export default function LoginScreen({ onToggleView }: LoginScreenProps): React.ReactElement {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const emailId = 'login-email';
  const passId = 'login-password';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError(String((err as { message?: string }).message) || 'Error en l’inici de sessió.');
      } else {
        setError('Error en l’inici de sessió.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm animate-fade-in">
      <h1 className="mb-2 text-center text-3xl font-bold text-brand-dark">Inicia sessió</h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Introdueix les teves credencials per continuar.
      </p>

      {error && (
        <p role="alert" aria-live="assertive" className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700">
            Correu electrònic
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div>
          <label htmlFor={passId} className="block text-sm font-medium text-gray-700">
            Contrasenya
          </label>
          <input
            id={passId}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Entrant…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        No tens compte?{' '}
        <button
          type="button"
          onClick={onToggleView}
          className="font-semibold text-brand-primary hover:underline"
        >
          Registra&apos;t
        </button>
      </p>
    </div>
  );
}
