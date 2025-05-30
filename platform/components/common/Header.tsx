"use client";

import * as motion from "motion/react-client";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'motion/react';

import TeamInfoModal from '@/components/common/TeamInfoModal';
import { useIsContestStarted } from '@/components/contexts/ContestContext';
import { useAuth } from '@/components/contexts/AuthContext';

function Header() {
    const { team } = useAuth();
    const pathname = usePathname();
    const isContestStarted = useIsContestStarted();

    const [isOpen, setIsOpen] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const navItems: Record<string, string> = {};

    if (team != null && isContestStarted) {
        navItems["Challenges"] = "/challenges";
        navItems["Leaderboard"] = "/leaderboard";
    } else if (pathname === "/") {
        navItems["About Us"] = `/#about`;
        navItems["Memories"] = `/#memories`;
        navItems["FAQ"] = `/#faq`;
        navItems["Contact"] = `/#contact`;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black via-black/80 to-transparent">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex justify-between items-center w-full">
                        <a href="/" className="flex items-center">
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                HACKTO night
                            </span>
                        </a>

                        <div className="hidden sm:flex items-center space-x-8">
                            {Object.entries(navItems).map(([name, href]) => (
                                <a
                                    key={name}
                                    href={href}
                                    className="text-base font-medium text-white hover:text-purple-300 transition"
                                >
                                    {name}
                                </a>
                            ))}

                            {team != null && (
                                <button
                                    onClick={() => setShowSettingsModal(true)}
                                    className="px-3 py-1.5 rounded-md bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 text-white hover:from-purple-600/40 hover:to-blue-600/40 transition flex items-center gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{team.name}</span>
                                        <span className="bg-purple-700/50 text-purple-200 text-xs px-2 py-0.5 rounded-full">
                                            {team.score || 0} pts
                                        </span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex sm:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-600/20 focus:outline-none"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden bg-black/95 border-t border-white/10 backdrop-blur-sm pb-3 w-full"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {Object.entries(navItems).map(([name, href]) => (
                                <a
                                    key={name}
                                    href={href}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {name}
                                </a>
                            ))}

                            {team != null && (
                                <button
                                    onClick={() => {
                                        setShowSettingsModal(true);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-purple-600/20 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <span>Team: {team.name}</span>
                                        <span className="bg-purple-700/50 text-purple-200 text-xs px-2 py-0.5 rounded-full">
                                            {team.score || 0} pts
                                        </span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {team != null && (
                <TeamInfoModal
                    isOpen={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                />
            )}
        </header>
    );
}

export default Header;
