'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

/**
 * Contest State Management
 * 
 * This module provides a React context for managing contest state based on time.
 * It automatically determines the current state based on registration date, start date, and duration.
 * 
 * States:
 * - NOT_STARTED: Before registration opens or after contest ends
 * - REGISTRATION: Registration is open, but contest hasn't started
 * - STARTED: Contest is currently running
 */


export enum ContestState {
  NOT_STARTED = 'NOT_STARTED',
  REGISTRATION = 'REGISTRATION',
  STARTED = 'STARTED'
}

export const REGISTRATION_START_DATE = new Date("2025-05-19T00:00:00+05:30");
export const CONTEST_START_DATE = new Date("2025-05-30T22:00:00+05:30");
export const CONTEST_DURATION_HOURS = 8;


type ContestContextType = {
  contestState: ContestState;
};


const ContestContext = createContext<ContestContextType | undefined>(undefined);


type ContestProviderProps = {
  children: ReactNode;
};


export function ContestProvider({ children }: ContestProviderProps) {
  const [contestState, setContestState] = useState<ContestState>(ContestState.NOT_STARTED);

  
  useEffect(() => {
    
    const updateContestState = () => {
      const now = new Date();
      const endDate = new Date(CONTEST_START_DATE.getTime() + (CONTEST_DURATION_HOURS * 60 * 60 * 1000));
      
      if (now >= CONTEST_START_DATE && now < endDate) {
        
        setContestState(ContestState.STARTED);
      } else if (now >= REGISTRATION_START_DATE && now < CONTEST_START_DATE) {
        
        setContestState(ContestState.REGISTRATION);
      } else {
        
        setContestState(ContestState.NOT_STARTED);
      }
    };

    
    updateContestState();
    
    
    const interval = setInterval(updateContestState, 60000);
    
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ContestContext.Provider value={{ contestState }}>
      {children}
    </ContestContext.Provider>
  );
}


export function useContest(): ContestContextType {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error('useContest must be used within a ContestProvider');
  }
  return context;
}


export function useContestState(): ContestState {
  const { contestState } = useContest();
  return contestState;
}

export function useIsContestNotStarted(): boolean {
  const { contestState } = useContest();
  return contestState === ContestState.NOT_STARTED;
}

export function useIsRegistrationOpen(): boolean {
  const { contestState } = useContest();
  return contestState === ContestState.REGISTRATION;
}

export function useIsContestStarted(): boolean {
  const { contestState } = useContest();
  return contestState === ContestState.STARTED;
} 