'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export const REGISTRATION_START_DATE = new Date("2025-05-19T00:00:00+05:30");
export const CONTEST_START_DATE = new Date("2025-05-27T00:00:00+05:30");
export const CONTEST_DURATION_HOURS = 12;

/**
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

type ContestContextType = {
    contestState: ContestState;
};

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export function ContestProvider({ children }: { children: ReactNode }) {
    const [contestState, setContestState] = useState<ContestState>(ContestState.NOT_STARTED);

    const updateContestState = () => {
        const now = new Date();
        const endDate = new Date(CONTEST_START_DATE.getTime() + (CONTEST_DURATION_HOURS * 60 * 60 * 1000));

        setContestState(ContestState.STARTED);
        return
        if (now >= CONTEST_START_DATE && now < endDate) {
        } else if (now >= REGISTRATION_START_DATE && now < CONTEST_START_DATE) {
            setContestState(ContestState.REGISTRATION);
        } else {
            setContestState(ContestState.NOT_STARTED);
        }
    };

    useEffect(() => {
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
    const context = useContext(ContestContext)!;
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
