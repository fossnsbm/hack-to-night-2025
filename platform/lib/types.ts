export type Member = {
    id: number;
    name: string;
    email: string;
    score: number;
};

export type Team = {
    id: number;
    name: string;
    leader: Member;
    score: number;
    members: Member[];
};

export type Challenge = {
    id: number;
    title: string;
    category: string;
    solved: boolean;
    solves: number;
    points: number;
};

export type ChallengeExtended = Challenge & {
    description: string;
    connection_info: string | null;
    files: string[];
}

export type UpdateTeamDto = {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
}
