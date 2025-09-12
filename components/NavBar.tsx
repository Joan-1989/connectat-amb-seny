import React from 'react';
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

const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-1/4 p-2 transition-colors duration-200 ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-primary'}`}>
        {icon}
        <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
);


export default function NavBar({ activeModule, setActiveModule }: NavBarProps): React.ReactElement {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex z-20">
      <NavButton
        label="Informa't"
        icon={<InfoIcon />}
        isActive={activeModule === "Informa't"}
        onClick={() => setActiveModule("Informa't")}
      />
      <NavButton
        label="Entrena't"
        icon={<TrainIcon />}
        isActive={activeModule === "Entrena't"}
        onClick={() => setActiveModule("Entrena't")}
      />
      <NavButton
        label="Activa't"
        icon={<ActivateIcon />}
        isActive={activeModule === "Activa't"}
        onClick={() => setActiveModule("Activa't")}
      />
      <NavButton
        label="Perfil"
        icon={<ProfileIcon />}
        isActive={activeModule === "Perfil"}
        onClick={() => setActiveModule("Perfil")}
      />
    </nav>
  );
}