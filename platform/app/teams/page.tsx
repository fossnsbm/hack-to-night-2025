'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/common/AppLayout';
import { User, Team } from '@/lib/schema';

export default function TeamsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      
      const userResponse = await fetch('/api/auth/me');
      const userData = await userResponse.json();

      if (!userData.authenticated) {
        router.push('/');
        return;
      }

      setUser(userData.user);

      
      if (userData.user.teamId) {
        const teamResponse = await fetch(`/api/teams/${userData.user.teamId}`);
        const teamData = await teamResponse.json();

        if (teamResponse.ok) {
          setUserTeam(teamData.team);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    if (teamName.length < 3 || teamName.length > 30) {
      setError('Team name must be between 3 and 30 characters');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Team created successfully!');
        setUserTeam(data.team);
        
        fetchUserData();
      } else {
        setError(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      setError('An error occurred while creating the team');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Team Management</h1>

        {userTeam ? (
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Your Team</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <h3 className="text-xl font-bold text-white">{userTeam.name}</h3>
                  <p className="text-gray-400 mt-1">Team Score: <span className="text-cyan-400 font-medium">{userTeam.score} points</span></p>
                </div>
                
                {user?.id === userTeam.leaderId && (
                  <div className="mt-4 sm:mt-0">
                    <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full">
                      Team Leader
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-3">Team Invite Link</h4>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/teams/join?code=${userTeam.id}`}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/teams/join?code=${userTeam.id}`);
                      setSuccess('Invite link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-r-lg hover:bg-cyan-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Share this link with your teammates to invite them to your team.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Create a Team</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-400">
                {success}
              </div>
            )}
            
            <form onSubmit={handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
                    Team Name
                  </label>
                  <input
                    id="teamName"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                  <p className="mt-1 text-sm text-gray-400">Choose a unique team name (3-30 characters)</p>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Join a Team</h2>
              <p className="text-gray-300 mb-4">
                If you've been invited to join a team, ask your team leader for the invite link or team code.
              </p>
              <button
                onClick={() => router.push('/teams/join')}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Join Existing Team
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 