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
    type?: string;
};

export type ChallengeExtended = Challenge & {
    description: string;
    files: string[];
    docker_image?: string;
}

export type UpdateTeamDto = {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
}

export type DockerContainer = {
    id: number;
    team_id: string | null;
    user_id: string | null;
    docker_image: string;
    timestamp: number;
    revert_time: number;
    instance_id: string;
    ports: string[];
    host: string;
    challenge?: string;
}

export type DockerStatus = {
    success: boolean;
    data: DockerContainer[];
}
