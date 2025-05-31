"use server";

import { ContestState, validateContestState } from "@/lib/contest-utils";
import { api } from "@/lib/ctfd";
import { verifyToken } from "@/lib/server-utils";
import { Challenge, ChallengeExtended, DockerContainer, Member, Team } from "@/lib/types";

export async function getTeamAndMember(token: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Team information is not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const { tid, uid } = res;
        const teamRes = await api({
            path: `/teams/${tid}`,
        });

        if (teamRes == null) {
            console.error(teamRes)
            return { success: false, error: "internal server error" }
        }

        if (!teamRes.success) {
            return { success: false, error: "invalid token" }
        }

        const memberMap: Record<number, Member> = {}

        for (const member of teamRes.data.members) {
            const memRes = await api({
                path: `/users/${member}`
            })

            if (memRes == null) {
                return { success: false, error: "internal server error" }
            }

            if (!memRes.success) {
                return { success: false, error: "internal server error" }
            }

            memberMap[member] = {
                id: member,
                name: memRes.data.name,
                email: memRes.data.email,
                score: memRes.data.score
            }
        }

        const team: Team = {
            id: teamRes.data.id,
            name: teamRes.data.name,
            members: Object.values(memberMap),
            leader: memberMap[teamRes.data.captain_id],
            score: teamRes.data.score
        }

        return { success: true, team, member: memberMap[uid] }
    }

    return { success: false, error: "invalid token" }
}

export async function getTeamChallenges(token: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Challenges are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const {tid} = res;
        const challengesRes = await api({
            path: "/challenges",
        });

        if (challengesRes == null || !challengesRes.success) {
            console.error(challengesRes)
            return { success: false, error: "internal server error" }
        }

        const solvesRes = await api({
            path: `/teams/${tid}/solves`
        });

        if (solvesRes == null || !solvesRes.success) {
            console.error(solvesRes)
            return { success: false, error: "internal server error" }
        }

        const challenges: Record<string, Challenge[]> = {}
        for (const challenge of challengesRes.data) {
            if (!challenges[challenge.category]) {
                challenges[challenge.category] = []
            }

            challenges[challenge.category].push({
                id: challenge.id,
                title: challenge.name,
                category: challenge.category,
                solved: solvesRes.data.find((s: any) => s.challenge_id === challenge.id) != null,
                solves: challenge.solves,
                points: challenge.value,
                type: challenge.type
            });
        }

        return { success: true, challenges }
    }

    return { success: false, error: "invalid token" }
}

export async function getChallengeExtended(token: string, id: number) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Challenge details are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const {tid} = res;
        const challengeRes = await api({
            path: `/challenges/${id}`,
        });

        if (challengeRes == null || !challengeRes.success) {
            console.error(challengeRes)
            return { success: false, error: "internal server error" }
        }

        const solvesRes = await api({
            path: `/teams/${tid}/solves`
        });

        if (solvesRes == null || !solvesRes.success) {
            console.error(solvesRes)
            return { success: false, error: "internal server error" }
        }

        return {
            success: true,
            challenge: {
                id: challengeRes.data.id,
                title: challengeRes.data.name,
                category: challengeRes.data.category,
                solved: solvesRes.data.find((s: any) => s.challenge_id === challengeRes.data.id) != null,
                solves: challengeRes.data.solves,
                points: challengeRes.data.value,
                type: challengeRes.data.type,
                description: challengeRes.data.description,
                files: challengeRes.data.files,
                docker_image: challengeRes.data.docker_image,
            } as ChallengeExtended
        }
    }

    return { success: false, error: "invalid token" }
}

export async function submitFlag(token: string, cid: number, flag: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Flag submission is not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const attemptRes = await api({
            path: `/challenges/attempt`,
            method: "POST",
            params: {
                preview: "true"
            },
            body: {
                challenge_id: cid,
                submission: flag
            }
        });

        if (attemptRes == null || !attemptRes.success) {
            console.error(attemptRes)
            return { success: false, error: "internal server error" }
        }

        let correct = false

        if (attemptRes.data.status === "correct") {
            const {tid, uid} = res;
            const subRes = await api({
                path: `/submissions`,
                method: "POST",
                body: {
                    challenge_id: cid,
                    user_id: uid,
                    team_id: tid,
                    provided: flag,
                    type: "correct",
                }
            });

            if (subRes == null || !subRes.success) {
                console.error(subRes)
                return { success: false, error: "internal server error" }
            }

            correct = true
        }

        return { success: true, correct }
    }

    return { success: false, error: "invalid token" }
}

export async function getLeaderboardTeams(token: string) {
    const sbRes = await api({
        path: `/scoreboard`,
    });

    if (sbRes == null || !sbRes.success) {
        console.error(sbRes)
        return { success: false, error: "internal server error" }
    }
    
    const teams: Team[] = sbRes.data.map((t: any) => ({
        id: t.account_id,
        name: t.name,
        score: t.score
    } as Team));

    return { success: true, teams }
}

export async function getDockerStatus(token: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Docker containers are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const dockerRes = await api({
            path: `/docker_status`,
        });

        if (dockerRes == null || !dockerRes.success) {
            console.error(dockerRes);
            return { success: false, error: "Failed to get Docker status" };
        }

        return { 
            success: true, 
            containers: dockerRes.data as DockerContainer[] 
        };
    }

    return { success: false, error: "invalid token" };
}

export async function startDockerContainer(token: string, challengeId: number, dockerImage: string, challengeName: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Docker containers are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        try {
            const containerRes = await api({
                path: `/container`,
                params: {
                    name: dockerImage,
                    challenge: challengeName
                }
            });

            if (containerRes == null || !containerRes.success) {
                // Check if it's a 403 error (container already running or other restriction)
                if (containerRes?.status === 403) {
                    return { success: false, error: containerRes.message || "Container operation not allowed" };
                }
                console.error(containerRes);
                return { success: false, error: "Failed to start Docker container" };
            }

            return { success: true };
        } catch (error) {
            console.error("Error starting Docker container:", error);
            return { success: false, error: "Failed to start Docker container" };
        }
    }

    return { success: false, error: "invalid token" };
}

export async function stopDockerContainer(token: string, challengeId: number, dockerImage: string, challengeName: string) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Docker containers are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        try {
            const containerRes = await api({
                path: `/container`,
                params: {
                    name: dockerImage,
                    challenge: challengeName,
                    stopcontainer: "true"
                }
            });

            if (containerRes == null || !containerRes.success) {
                console.error(containerRes);
                return { success: false, error: "Failed to stop Docker container" };
            }

            return { success: true };
        } catch (error) {
            console.error("Error stopping Docker container:", error);
            return { success: false, error: "Failed to stop Docker container" };
        }
    }

    return { success: false, error: "invalid token" };
}
