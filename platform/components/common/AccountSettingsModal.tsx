"use client";

import { useState, useEffect } from 'react';
import { useTeam } from '@/components/contexts/TeamContext';
import { mockUpdateTeam } from '@/lib/mockData';
import Modal from './Modal';

type TeamMember = {
  name: string;
  email: string;
  isLeader?: boolean;
};

type ActiveSection = 'password' | 'members' | null;

export default function AccountSettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { team, refreshTeam, logout } = useTeam();
  const [teamName, setTeamName] = useState(team?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  
  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setMembers(team.members.map(member => ({
        name: member.name,
        email: member.email,
        isLeader: member.email === team.leader
      })));
    }
  }, [team]);

  useEffect(() => {
    if (activeSection !== 'password') {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [activeSection]);

  const isLeader = team?.leader === team?.members?.find(m => m.email === team.leader)?.email;
  
  useEffect(() => {
    if (team) {
      console.log('Team Leader Email:', team.leader);
      console.log('Current User Leader Status:', isLeader);
      console.log('Team Members:', team.members);
    }
  }, [team, isLeader]);

  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLeader) {
      setError('Only the team leader can update team settings');
      return;
    }
    
    if (activeSection === 'password') {
      if (!currentPassword) {
        setError('Current password is required');
        return;
      }
      
      if (!newPassword) {
        setError('New password is required');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const updateData: { name?: string; currentPassword?: string; newPassword?: string; members?: TeamMember[] } = {};
      
      if (teamName && teamName !== team?.name) {
        updateData.name = teamName;
      }
      
      if (activeSection === 'password' && currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      if (members.some((member, idx) => 
        member.name !== team?.members[idx]?.name || 
        member.email !== team?.members[idx]?.email
      )) {
        updateData.members = members;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        setIsSubmitting(false);
        return;
      }

      const result = await mockUpdateTeam(updateData);
      
      if (result.success) {
        setSuccess('Team settings updated successfully');
        await refreshTeam();
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveSection(null);
      } else {
        setError(result.error || 'Failed to update team settings');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSection = (section: ActiveSection) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex flex-col">
        <div className="p-5">
          <h3 className="text-xl font-medium text-white mb-4">Team Settings</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded text-sm text-red-400">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900/40 border border-green-700 rounded text-sm text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateTeam}>
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-1">Team Name</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                placeholder="Enter team name"
                disabled={!isLeader || isSubmitting}
              />
            </div>
            
            {isLeader && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection('password')}
                  className="flex w-full items-center justify-between px-3 py-2 bg-gray-900/70 backdrop-blur-sm rounded-lg border border-blue-500/30 mb-2"
                >
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-white">Change Password</h3>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${activeSection === 'password' ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {activeSection === 'password' && (
                  <div className="mb-2 px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                        placeholder="Enter current password"
                        disabled={!isLeader || isSubmitting}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm text-gray-300 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                        placeholder="Enter new password"
                        disabled={!isLeader || isSubmitting}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                        placeholder="Confirm new password"
                        disabled={!isLeader || isSubmitting}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-6">
              <button
                type="button"
                onClick={() => toggleSection('members')}
                className="flex w-full items-center justify-between px-3 py-2 bg-gray-900/70 backdrop-blur-sm rounded-lg border border-blue-500/30 mb-2"
              >
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-white">Team Members ({members.length})</h3>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${activeSection === 'members' ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeSection !== 'members' && (
                <div className="flex flex-wrap gap-1.5 px-2 py-1.5">
                  {members.map((member, idx) => (
                    <div 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-gray-800 text-white border border-gray-700"
                    >
                      {member.name} {member.isLeader && <span className="text-amber-400">(Leader)</span>}
                    </div>
                  ))}
                </div>
              )}
              
              {activeSection === 'members' && (
                <div className="mt-2">
                  <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 mb-2">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-white">
                        {activeSlide === 0 ? 'Team Leader' : `Member ${activeSlide + 1}`}
                      </h3>
                      
                      <div className="flex gap-2 items-center">
                        <button 
                          type="button" 
                          onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                          className="text-sm px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={activeSlide === 0 || isSubmitting}
                        >
                          &larr;
                        </button>
                        <span className="text-xs text-center py-1 min-w-[40px]">
                          {activeSlide + 1} / {members.length}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setActiveSlide(Math.min(members.length - 1, activeSlide + 1))}
                          className="text-sm px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={activeSlide === members.length - 1 || isSubmitting}
                        >
                          &rarr;
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 text-sm rounded bg-gray-800 border border-gray-700 text-white" 
                          placeholder="Full Name"
                          value={members[activeSlide]?.name || ''}
                          onChange={(e) => updateMember(activeSlide, 'name', e.target.value)}
                          disabled={!isLeader || isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 text-sm rounded bg-gray-800 border border-gray-700 text-white" 
                          placeholder="member@email.com"
                          value={members[activeSlide]?.email || ''}
                          onChange={(e) => updateMember(activeSlide, 'email', e.target.value)}
                          disabled={!isLeader || isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-1 mt-3">
                    {members.map((_, index) => (
                      <button 
                        key={index} 
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`w-2 h-2 rounded-full ${activeSlide === index ? 'bg-blue-500' : 'bg-gray-600'}`}
                        disabled={isSubmitting}
                        aria-label={`View member ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isLeader || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              
              {!isLeader && (
                <p className="text-sm text-amber-400 mb-2">
                  Only the team leader can update team settings
                </p>
              )}
              
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                Log Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}