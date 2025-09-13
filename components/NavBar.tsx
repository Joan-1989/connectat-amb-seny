// components/NavBar.tsx
import React, { memo } from 'react';
import type { ActiveModule } from '../types';
import { InfoIcon, TrainIcon, ActivateIcon, ProfileIcon } from './icons/NavIcons';

interface NavBarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

interface NavButtonProps {
  label: ActiveModule;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = memo(function NavButton({ label, icon, isActive, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 p-2 transition-colors duration-200
        ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded`}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
    >
      {/* Si els teus icones admeten className, pots afegir-hi h-6 w-6 per mida consistent */}
      {icon}
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
});

const TABS: ReadonlyArray<{ key: ActiveModule; label: ActiveModule; icon: React.ReactNode }> = [
  { key: "Informa't", label: "Informa't", icon: <InfoIcon /> },
  { key: "Entrena't", label: "Entrena't", icon: <TrainIcon /> },
  { key: "Activa't",  label: "Activa't",  icon: <ActivateIcon /> },
  { key: "Perfil",    label: "Perfil",    icon: <ProfileIcon /> },
] as const;

export default function NavBar({ activeModule, setActiveModule }: NavBarProps): React.ReactElement {
  return (
    <nav
      role="navigation"
      aria-label="Navegació principal"
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 flex z-20 pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map(tab => (
        <NavButton
          key={tab.key}
          label={tab.label}
          icon={tab.icon}
          isActive={activeModule === tab.key}
          onClick={() => setActiveModule(tab.key)}
        />
      ))}
    </nav>
  );
}
