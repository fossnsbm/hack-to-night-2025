'use client';

import { useEffect, useMemo, useState } from 'react';

import { getLeaderboardTeams } from '@/actions/team';
import LoadingSection from '@/components/common/LoadingSection';
import { Team } from '@/lib/types';

function LeaderboardContent() {
    const [teams, setTeams] = useState<Team[] | null>(null);

    const totalPointsAwarded = useMemo(() => {
        return teams?.reduce((sum, team) => sum + team.score, 0) ?? 0
    }, [teams]);

    async function fetchTeams() {
        const res = await getLeaderboardTeams()
        if (res.success) {
            setTeams(res.teams!)
        } else {
            alert(res.error)
            setTeams(null)
        }
    }

    useEffect(() => {
        fetchTeams()
    }, []);

    return (
        <LoadingSection id="leaderboard" loading={teams == null}>
            {teams != null && (
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">Leaderboard</h1>
                        {/*<button
                            className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500 rounded text-white text-sm transition-colors flex items-center gap-2 cursor-not-allowed opacity-50"
                            onClick={fetchTeams}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                            <span>Refresh</span>
                        </button>*/}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
                            <h3 className="text-gray-400 text-xs font-semibold uppercase">Teams</h3>
                            <p className="text-2xl font-bold text-white">{teams!.length}</p>
                        </div>
                        <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
                            <h3 className="text-gray-400 text-xs font-semibold uppercase">Total Points</h3>
                            <p className="text-2xl font-bold text-cyan-400">{totalPointsAwarded}</p>
                        </div>
                    </div>

                    <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg">
                        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-gray-800/20">
                            <table className="w-full text-white">
                                <thead className="bg-gray-800/80 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {teams!.map((team, index) => (
                                        <tr key={team.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`
                              flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                              ${index === 0 ? 'bg-yellow-500 text-black' :
                                                            index === 1 ? 'bg-gray-300 text-black' :
                                                                index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-700 text-white'}
                            `}>
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">{team.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-cyan-400 font-bold">
                                                {team.score} pts
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </LoadingSection>
    );
}

export default function LeaderboardPage() {
    return <LeaderboardContent />;
} 
