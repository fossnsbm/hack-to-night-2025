"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { getSession } from '@/actions/auth/getSession';
import { logout } from '@/actions/auth/logout';

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
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);

  async function refreshTeam() {
    try {
      setIsLoading(true);
      const sessionData = await getSession();
      
      if (sessionData.authenticated && sessionData.team) {
        setIsAuthenticated(true);
        setTeam(sessionData.team);
      } else {
        setIsAuthenticated(false);
        setTeam(null);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setIsAuthenticated(false);
      setTeam(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setIsAuthenticated(false);
      setTeam(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  useEffect(() => {
    refreshTeam();
  }, []);

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