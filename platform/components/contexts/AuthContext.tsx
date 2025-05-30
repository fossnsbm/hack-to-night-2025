"use client";

import { getTeamAndMember } from '@/actions/team';
import { Member, Team } from '@/lib/types';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type AuthContextType = {
    team: Team | null;
    member: Member | null;
    token: string | null;
    refresh: () => Promise<void>;
    saveToken: (token: string) => void;
    clearToken: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [team, setTeam] = useState<Team | null>(null);
    const [member, setMember] = useState<Member | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function refresh() {
        if (token) {
            const res = await getTeamAndMember(token);
            if (res.success) {
                setTeam(res.team!);
                setMember(res.member!);
                localStorage.setItem("token", token);
                return;
            } else {
                alert("Something went wrong: " + JSON.stringify(res));
            }
        }

        setTeam(null);
        setMember(null);
        localStorage.removeItem("token");
    }

    function saveToken(token: string) {
        localStorage.setItem("token", token);
        setToken(token);
    }

    function clearToken() {
        localStorage.removeItem("token");
        setToken(null);
    }

    useEffect(() => {
        if (token == null) {
            const savedToken = localStorage.getItem("token");
            if (savedToken != null) {
                saveToken(savedToken)
            }
        }

        refresh();
    }, [token]);

    useEffect(() => {
    }, []);

    return (
        <AuthContext.Provider
            value={{
                team,
                member,
                token,
                refresh,
                saveToken,
                clearToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)!;
    return context;
}

export function useIsLeader() {
    const { team, member } = useAuth();
    return team != null ? team!.leader.id === member!.id : false;
}
