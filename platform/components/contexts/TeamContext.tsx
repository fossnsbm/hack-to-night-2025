"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Member = {
  id: number;
  name: string;
  email: string;
};

type Team = {
  id: number;
  name: string;
  leader: string;
  score: number;
  members: Member[];
};

type TeamContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  team: Team | null;
  refreshTeam: () => Promise<void>;
  logout: () => Promise<void>;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);

  async function refreshTeam() {
    
    return;
  }

  async function handleLogout() {
    
    setIsAuthenticated(false);
    setTeam(null);
  }

  return (
    <TeamContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        team, 
        refreshTeam, 
        logout: handleLogout 
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
} 