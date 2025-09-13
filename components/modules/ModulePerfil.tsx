import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import type { Badge } from '../../types';

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
  <div className="bg-amber-50 p-4 rounded-lg flex items-center space-x-4 border border-amber-200">
    <span className="text-4xl">{badge.icon}</span>
    <div>
      <h4 className="font-bold text-amber-800">{badge.name}</h4>
      <p className="text-sm text-amber-700">{badge.description}</p>
    </div>
  </div>
);

export default function ModulePerfil(): React.ReactElement {
  const { currentUser, logout } = useAuth();
  const { earnedBadges, getBadgeDetails } = useGamification();

  if (!currentUser) {
    return <div>No s'ha trobat l'usuari.</div>;
  }

  // 🔒 Null-safety en cas que el perfil o l'edat no existeixin
  const email = (currentUser as any)?.email ?? '—';
  const profileType = (currentUser as any)?.profile?.type ?? '—';
  const age = (currentUser as any)?.profile?.age as number | undefined;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-brand-dark">El Meu Perfil</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Correu Electrònic</p>
            <p className="font-semibold">{email}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Tipus de Perfil</p>
            <p className="font-semibold">{profileType}</p>
          </div>
          {typeof age === 'number' && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">Edat</p>
              <p className="font-semibold">{age}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-brand-dark">Les Meves Insígnies</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {earnedBadges.length > 0 ? (
            <div className="space-y-4">
              {earnedBadges.map((badgeId) => {
                const badge = getBadgeDetails(badgeId) as Badge | undefined;
                if (!badge) return null; // guard per evitar errors si no es troba el badge
                return <BadgeCard key={badgeId} badge={badge} />;
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>Encara no has guanyat cap insígnia.</p>
              <p className="text-sm mt-1">Explora la secció "Entrena't" per començar a completar reptes!</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
      >
        Tancar Sessió
      </button>
    </div>
  );
}
