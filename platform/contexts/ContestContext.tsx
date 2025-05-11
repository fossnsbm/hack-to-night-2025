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

// Contest state types
export enum ContestState {
  NOT_STARTED = 'NOT_STARTED',
  REGISTRATION = 'REGISTRATION',
  STARTED = 'STARTED'
}

// Contest context type
type ContestContextType = {
  contestState: ContestState;
  startDate: Date;
  registrationDate: Date;
  duration: number; // in hours
};

// Create the context
const ContestContext = createContext<ContestContextType | undefined>(undefined);

// Provider props
type ContestProviderProps = {
  children: ReactNode;
  initialStartDate: Date;
  initialRegistrationDate: Date;
  initialDuration: number;
};

// Provider component
export function ContestProvider({
  children,
  initialStartDate,
  initialRegistrationDate,
  initialDuration
}: ContestProviderProps) {
  const [startDate] = useState<Date>(initialStartDate);
  const [registrationDate] = useState<Date>(initialRegistrationDate);
  const [duration] = useState<number>(initialDuration);
  const [contestState, setContestState] = useState<ContestState>(ContestState.NOT_STARTED);

  // Calculate contest state based on current time
  useEffect(() => {
    // Update the contest state initially and every minute
    const updateContestState = () => {
      const now = new Date();
      const endDate = new Date(startDate.getTime() + (duration * 60 * 60 * 1000));
      
      if (now >= startDate && now < endDate) {
        // Contest is active
        setContestState(ContestState.STARTED);
      } else if (now >= registrationDate && now < startDate) {
        // Registration period
        setContestState(ContestState.REGISTRATION);
      } else {
        // Not started or already ended
        setContestState(ContestState.NOT_STARTED);
      }
    };

    // Update state immediately
    updateContestState();
    
    // Then update every minute
    const interval = setInterval(updateContestState, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [startDate, registrationDate, duration]);

  return (
    <ContestContext.Provider value={{ 
      contestState, 
      startDate, 
      registrationDate, 
      duration 
    }}>
      {children}
    </ContestContext.Provider>
  );
}

// Custom hook to use the contest context
export function useContest(): ContestContextType {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error('useContest must be used within a ContestProvider');
  }
  return context;
}

// Helper hooks for common state checks
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