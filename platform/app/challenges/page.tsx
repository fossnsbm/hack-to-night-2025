"use client"

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import LoadingSection from "@/components/common/LoadingSection";
import { useAuth } from "@/components/contexts/AuthContext";
import { getButtonClasses, getCardClasses } from "@/lib/client-utils";
import { getTeamChallenges } from "@/actions/team";
import { Challenge } from "@/lib/types";

export default function Challenges() {
    const { token, team } = useAuth();

    const [challenges, setChallenges] = useState<Record<string, Challenge[]> | null>(null);
    const categories = useMemo(() => {
        return challenges ? Object.keys(challenges) : []
    }, [challenges]);

    async function fetchChallenges() {
        if (token) {
            const res = await getTeamChallenges(token);
            if (res.success) {
                setChallenges(res.challenges!);
            } else {
                alert(res.error);
                setChallenges(null);
            }
        } else {
            setChallenges(null)
        }
    }

    useEffect(() => {
        fetchChallenges();
    }, [team]);

    return (
        <LoadingSection id="challenges" loading={challenges == null}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Challenges</h1>
                    <button
                    className={getButtonClasses('secondary', 'sm')}
                        onClick={fetchChallenges}
                    >
                        <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                            Refresh
                        </span>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    {categories!.length === 0 ? (
                        <div className={getCardClasses('dark', 'lg') + ' text-center'}>
                            <p className="text-gray-400">No challenges are available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-8">
                            {categories!.map((category: string) => (
                                <div key={category} className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                                        {category}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {challenges![category].map((challenge: Challenge) => (
                                            <Link
                                                href={`/challenges/${challenge.id}`}
                                                key={challenge.id}
                                                className={`group block p-6 rounded-lg border transition duration-200 ${challenge.solved
                                                        ? "bg-green-900/20 border-green-700 hover:bg-green-900/30"
                                                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-800/80"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-medium text-white group-hover:text-white/90">
                                                        {challenge.title}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${challenge.solved
                                                            ? "bg-green-800 text-green-200"
                                                            : "bg-purple-800 text-purple-200"
                                                        }`}>
                                                        {challenge.points} pts
                                                    </span>
                                                </div>

                                                { /* <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {challenge.description}
                                                </p> */}

                                                <div className="flex justify-between items-center">
                                                    {/*<span className="text-xs bg-gray-700/50 px-2 py-1 rounded text-gray-300">
                                                        {challenge.difficulty}
                                                    </span>*/}

                                                    {challenge.solved && (
                                                        <span className="text-xs font-medium text-green-400 flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                                <path d="M20 6L9 17l-5-5" />
                                                            </svg>
                                                            Solved
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </LoadingSection>
    );
}
