"use server";

import { api } from "@/lib/ctfd";
import { verifyToken } from "@/lib/server-utils";
import { Challenge, ChallengeExtended, Member, Team } from "@/lib/types";

export async function getTeamAndMember(token: string) {
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
                points: challenge.value
            });
        }

        return { success: true, challenges }
    }

    return { success: false, error: "invalid token" }
}

export async function getChallengeExtended(token: string, id: number) {
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
                description: challengeRes.data.description,
                connection_info: challengeRes.data.connection_info,
                files: challengeRes.data.files,
            } as ChallengeExtended
        }
    }

    return { success: false, error: "invalid token" }
}

export async function submitFlag(token: string, cid: number, flag: string) {
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
    const res = await verifyToken(token);
    if (res) {
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

    return { success: false, error: "invalid token" }
}
