'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Read contest dates from environment variables
export const REGISTRATION_START_DATE = new Date(process.env.NEXT_PUBLIC_REGISTRATION_START_DATE || "2025-05-19T00:00:00+05:30");
export const REGISTRATION_END_DATE = new Date(process.env.NEXT_PUBLIC_REGISTRATION_END_DATE || "2025-05-30T00:00:00+05:30");
export const CONTEST_START_DATE = new Date(process.env.NEXT_PUBLIC_CONTEST_START_DATE || "2025-05-30T19:00:00+05:30");
export const CONTEST_DURATION_HOURS = parseInt(process.env.NEXT_PUBLIC_CONTEST_DURATION_HOURS || "10", 10);

/**
 * States:
 * - NOT_STARTED: Before registration opens or after contest ends
 * - REGISTRATION: Registration is open, but contest hasn't started
 * - REGISTRATION_CLOSED: Registration has closed, but contest hasn't started yet
 * - STARTED: Contest is currently running
 */

export enum ContestState {
    NOT_STARTED = 'NOT_STARTED',
    REGISTRATION = 'REGISTRATION',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
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

        if (now >= CONTEST_START_DATE && now < endDate) {
            setContestState(ContestState.STARTED);
        } else if (now >= REGISTRATION_END_DATE && now < CONTEST_START_DATE) {
            setContestState(ContestState.REGISTRATION_CLOSED);
        } else if (now >= REGISTRATION_START_DATE && now < REGISTRATION_END_DATE) {
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

export function useIsRegistrationClosed(): boolean {
    const { contestState } = useContest();
    return contestState === ContestState.REGISTRATION_CLOSED;
}

export function useIsContestStarted(): boolean {
    const { contestState } = useContest();
    return contestState === ContestState.STARTED;
}

export function useIsRegistrationDisabled(): boolean {
    const { contestState } = useContest();
    return contestState === ContestState.NOT_STARTED || contestState === ContestState.REGISTRATION_CLOSED;
} 
