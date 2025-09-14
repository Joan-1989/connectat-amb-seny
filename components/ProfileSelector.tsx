import React, { useState } from 'react';
import { ProfileType } from '../types';
import type { UserProfile } from '../types';

interface ProfileSelectorProps {
  onProfileSelect: (profile: UserProfile, age?: number) => void;
}

const JoveIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-brand-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const TutorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-brand-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfessionalIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-brand-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.05a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15M12 18.375V9.75M12 9.75l-4.5 4.5M12 9.75l4.5 4.5M3.75 8.25h16.5a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25z" />
  </svg>
);

const ProfileCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ title, description, icon, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left p-6 border-2 rounded-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary
      ${isSelected ? 'border-brand-primary bg-blue-50 shadow-lg ring-2 ring-brand-primary' : 'border-gray-200 bg-white hover:shadow-md'}`}
    aria-pressed={isSelected}
  >
    <div className="text-center">
      {icon}
      <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
      <p className="text-gray-500 mt-1 text-sm">{description}</p>
    </div>
  </button>
);

export default function ProfileSelector({ onProfileSelect }: ProfileSelectorProps): React.ReactElement {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [age, setAge] = useState<string>('');

  const handleContinue = (): void => {
    if (!selectedProfile) return;
    const profile: UserProfile = { type: selectedProfile };
    if (selectedProfile === 'Jove') {
      const userAge = parseInt(age, 10);
      if (!userAge || userAge < 13 || userAge > 18) {
        alert('Si us plau, introdueix una edat vàlida entre 13 i 18 anys.');
        return;
      }
      profile.age = userAge;
      onProfileSelect(profile, userAge);
    } else {
      onProfileSelect(profile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-brand-dark mb-2">Benvingut/da a</h1>
        <h2 className="text-4xl font-extrabold text-center text-brand-primary mb-6">Connecta&apos;t amb seny</h2>
        <p className="text-center text-gray-600 mb-8">Per començar, si us plau, tria el teu perfil.</p>

        <div className="space-y-4">
          <ProfileCard
            title="Jove"
            description="Eines i consells per a tu."
            icon={<JoveIcon />}
            isSelected={selectedProfile === 'Jove'}
            onClick={() => setSelectedProfile('Jove')}
          />
          <ProfileCard
            title="Tutor"
            description="Recursos per acompanyar."
            icon={<TutorIcon />}
            isSelected={selectedProfile === 'Tutor'}
            onClick={() => setSelectedProfile('Tutor')}
          />
          <ProfileCard
            title="Professional"
            description="Guies i material de suport."
            icon={<ProfessionalIcon />}
            isSelected={selectedProfile === 'Professional'}
            onClick={() => setSelectedProfile('Professional')}
          />
        </div>

        {selectedProfile === 'Jove' && (
          <div className="mt-6 animate-fade-in">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Quina és la teva edat?
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ex: 15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        )}

        {selectedProfile && (
          <button
            onClick={handleContinue}
            className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
