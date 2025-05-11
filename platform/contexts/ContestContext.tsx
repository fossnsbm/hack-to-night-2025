'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

// Define the enum for contest states using numeric values to ensure reliable comparison
export enum ContestState {
  NOT_STARTED = 0,    // Contest not started, registration closed
  REGISTRATION = 1,   // Registration open, contest not started
  STARTED = 2         // Contest started, login only
}

// Define the context type
type ContestContextType = {
  contestState: ContestState;
  setContestState: (state: ContestState) => void;
};

// Create the context with default values
const ContestContext = createContext<ContestContextType>({
  contestState: ContestState.NOT_STARTED,
  setContestState: () => {}
});

// Create a provider component
export function ContestProvider({ children, initialState }: { 
  children: ReactNode;
  initialState: ContestState;
}) {
  // Make sure to initialize with the correct type
  const [contestState, setContestState] = useState<ContestState>(
    initialState !== undefined ? initialState : ContestState.NOT_STARTED
  );

  return (
    <ContestContext.Provider value={{ 
      contestState, 
      setContestState
    }}>
      {children}
    </ContestContext.Provider>
  );
}

// Create a custom hook to use the context
export function useContest() {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error('useContest must be used within a ContestProvider');
  }
  return context;
} 