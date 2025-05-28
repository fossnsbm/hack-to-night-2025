"use client";

import { useState } from 'react';

import Modal from '@/components/common/Modal';
import { useAuth, useIsLeader } from '@/components/contexts/AuthContext';
import { UpdateTeamDto } from '@/lib/types';
import { updateTeam } from '@/actions/auth';

type Tab = 'info' | 'edit';

export default function TeamInfoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { team, token, refresh, clearToken } = useAuth();
    const isLeader = useIsLeader();

    const [activeTab, setActiveTab] = useState<Tab>('info');
    const [teamName, setTeamName] = useState(team?.name ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!isLeader) {
            setError('Only the team leader can update team settings');
            return;
        }

        if (newPassword) {
            if (!currentPassword) {
                setError('Current password is required');
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

            const updateData: UpdateTeamDto = {};

            if (teamName && teamName !== team?.name) {
                updateData.name = teamName;
            }

            if (currentPassword && newPassword) {
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            if (Object.keys(updateData).length === 0) {
                setError('No changes to save');
                setIsSubmitting(false);
                return;
            }

            const result = await updateTeam(token!, updateData);

            if (result.success) {
                setSuccess('Team settings updated successfully');
                await refresh();

                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
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
            clearToken();
            onClose();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
            <div className="flex flex-col h-full">
                <div className="p-5 flex-1">
                    <h3 className="text-xl font-medium text-white mb-4">Team Information</h3>

                    <div className="flex space-x-1 mb-6 bg-gray-900/70 backdrop-blur-sm rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                activeTab === 'info'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Info
                        </button>
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                                activeTab === 'edit'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Edit
                        </button>
                    </div>

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

                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            <div className="bg-gray-900/50 border border-gray-700 rounded-lg divide-y divide-gray-700">
                                {team?.members.map((member, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-medium">
                                                    {member.name}
                                                </h4>
                                                {team.leader.id === member.id && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                                        Leader
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400">{member.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-gray-400">Score</span>
                                            <p className="text-lg font-medium text-white">{member.score}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'edit' && (
                        <form onSubmit={handleUpdateTeam} className="space-y-6">
                            <div>
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

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                        placeholder="Enter current password"
                                        disabled={!isLeader || isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                        placeholder="Enter new password"
                                        disabled={!isLeader || isSubmitting}
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
                                    />
                                </div>
                            </div>

                            {!isLeader && (
                                <p className="text-sm text-amber-400">
                                    Only the team leader can update team settings
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isLeader || isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="p-5 pt-0">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </Modal>
    );
}
