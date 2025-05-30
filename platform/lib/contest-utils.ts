/**
 * Server-side contest utilities
 * These functions can be used in server actions and API routes
 */

export enum ContestState {
    NOT_STARTED = 'NOT_STARTED',
    REGISTRATION = 'REGISTRATION',
    REGISTRATION_CLOSED = 'REGISTRATION_CLOSED',
    STARTED = 'STARTED'
}

// Using the same NEXT_PUBLIC_ environment variables as the client
export const getContestDates = () => {
    const REGISTRATION_START_DATE = new Date(process.env.NEXT_PUBLIC_REGISTRATION_START_DATE || "2025-05-19T00:00:00+05:30");
    const REGISTRATION_END_DATE = new Date(process.env.NEXT_PUBLIC_REGISTRATION_END_DATE || "2025-05-30T00:00:00+05:30");
    const CONTEST_START_DATE = new Date(process.env.NEXT_PUBLIC_CONTEST_START_DATE || "2025-05-30T19:00:00+05:30");
    const CONTEST_DURATION_HOURS = parseInt(process.env.NEXT_PUBLIC_CONTEST_DURATION_HOURS || "10", 10);

    return {
        REGISTRATION_START_DATE,
        REGISTRATION_END_DATE,
        CONTEST_START_DATE,
        CONTEST_DURATION_HOURS
    };
};

/**
 * Get current contest state on server-side
 */
export const getContestState = (currentTime?: Date): ContestState => {
    const now = currentTime || new Date();
    const {
        REGISTRATION_START_DATE,
        REGISTRATION_END_DATE,
        CONTEST_START_DATE,
        CONTEST_DURATION_HOURS
    } = getContestDates();

    const endDate = new Date(CONTEST_START_DATE.getTime() + (CONTEST_DURATION_HOURS * 60 * 60 * 1000));

    if (now >= CONTEST_START_DATE && now < endDate) {
        return ContestState.STARTED;
    } else if (now >= REGISTRATION_END_DATE && now < CONTEST_START_DATE) {
        return ContestState.REGISTRATION_CLOSED;
    } else if (now >= REGISTRATION_START_DATE && now < REGISTRATION_END_DATE) {
        return ContestState.REGISTRATION;
    } else {
        return ContestState.NOT_STARTED;
    }
};

/**
 * Check if registration is currently open
 */
export const isRegistrationOpen = (currentTime?: Date): boolean => {
    return getContestState(currentTime) === ContestState.REGISTRATION;
};

/**
 * Check if registration is disabled (not started or closed)
 */
export const isRegistrationDisabled = (currentTime?: Date): boolean => {
    const state = getContestState(currentTime);
    return state === ContestState.NOT_STARTED || state === ContestState.REGISTRATION_CLOSED;
};

/**
 * Check if contest has started
 */
export const isContestStarted = (currentTime?: Date): boolean => {
    return getContestState(currentTime) === ContestState.STARTED;
};

/**
 * Validate that an action can be performed in the current contest state
 */
export const validateContestState = (
    allowedStates: ContestState[],
    currentTime?: Date
): { isValid: boolean; currentState: ContestState; message?: string } => {
    const currentState = getContestState(currentTime);
    const isValid = allowedStates.includes(currentState);

    let message: string | undefined;
    if (!isValid) {
        switch (currentState) {
            case ContestState.NOT_STARTED:
                message = "This action is not available. Registration has not started yet.";
                break;
            case ContestState.REGISTRATION_CLOSED:
                message = "Registration has closed. This action is no longer available.";
                break;
            case ContestState.STARTED:
                message = "Contest has started. This action is no longer available.";
                break;
            case ContestState.REGISTRATION:
                message = "This action is not available during registration period.";
                break;
        }
    }

    return { isValid, currentState, message };
}; 