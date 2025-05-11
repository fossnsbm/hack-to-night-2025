'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/common/AppLayout';
import { Team } from '@/lib/schema';
import { getLeaderboard } from '@/actions/teams';
import { useSocket } from '@/components/SocketProvider';

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, notifications, leaderboard: socketLeaderboard } = useSocket();

  // Use socket-provided leaderboard when available
  useEffect(() => {
    if (socketLeaderboard.length > 0) {
      setTeams(socketLeaderboard);
    }
  }, [socketLeaderboard]);
  
  // Initial fetch of leaderboard data
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Use server action instead of API call
      const leaderboardData = await getLeaderboard();
      setTeams(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (loading && teams.length === 0) {
    return (
      <AppLayout>
        <div className="snap-end min-h-screen flex items-center justify-center py-[50px] px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="snap-end container mx-auto py-[50px] px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-cyan-400 text-center">Leaderboard</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Leaderboard Table */}
          <div className="w-full lg:w-2/3">
            {teams.length === 0 ? (
              <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
                <p className="text-gray-400">No teams have scored points yet.</p>
              </div>
            ) : (
              <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg overflow-hidden">
                <table className="w-full text-white">
                  <thead className="bg-gray-800/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {teams.map((team, index) => (
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
            )}
          </div>
          
          {/* Live Activity Feed */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Live Activity</h2>
              
              {notifications.length === 0 ? (
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-blue-500/20">
                      <div className="flex justify-between items-start">
                        <span className="text-cyan-400 font-medium">{notification.teamName}</span>
                        <span className="text-xs text-gray-400">{formatDate(notification.timestamp)}</span>
                      </div>
                      <p className="text-white text-sm mt-1">
                        Solved <span className="font-semibold">{notification.challengeTitle}</span> for <span className="text-cyan-400">{notification.points} pts</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Real-time Status */}
            <div className="mt-6 bg-gray-900/70 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Real-time Status</h2>
                <div className={`flex items-center gap-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Leaderboard updates in real-time as teams solve challenges.
              </p>
              <button 
                onClick={fetchLeaderboard}
                className="mt-4 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500 rounded text-white text-sm transition-colors"
              >
                Refresh Manually
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 