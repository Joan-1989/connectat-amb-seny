import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Badge, BadgeId } from '../types';

// Define all available badges in the app
const ALL_BADGES: Record<BadgeId, Badge> = {
  'detox-bronze': { id: 'detox-bronze', name: 'Inici del Detox', description: 'Has completat el teu primer repte de desconnexió digital.', icon: '🥉' },
  'first-diary': { id: 'first-diary', name: 'Explorador Emocional', description: 'Has escrit la teva primera entrada al diari emocional.', icon: '✍️' },
  'myth-buster': { id: 'myth-buster', name: 'Caçador de Mites', description: 'Has completat el repte de Mites vs. Realitats.', icon: '👻' },
};


interface GamificationContextType {
  earnedBadges: BadgeId[];
  addBadge: (badgeId: BadgeId) => void;
  getBadgeDetails: (badgeId: BadgeId) => Badge;
  getAllBadges: () => Badge[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider = ({ children }: GamificationProviderProps) => {
  const [earnedBadges, setEarnedBadges] = useState<BadgeId[]>([]);

  const addBadge = useCallback((badgeId: BadgeId) => {
    setEarnedBadges(prevBadges => {
      if (prevBadges.includes(badgeId)) {
        return prevBadges; // Avoid duplicates
      }
      // Here you could add a toast notification to celebrate!
      console.log(`Badge earned: ${badgeId}`);
      return [...prevBadges, badgeId];
    });
  }, []);
  
  const getBadgeDetails = (badgeId: BadgeId): Badge => {
    return ALL_BADGES[badgeId];
  };

  const getAllBadges = (): Badge[] => {
    return Object.values(ALL_BADGES);
  }

  const value = {
    earnedBadges,
    addBadge,
    getBadgeDetails,
    getAllBadges,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
