"use client";

import { useState, useEffect } from "react";
import { getChallenges } from "@/actions/challenges/getChallenges";
import Link from "next/link";
import { useTeam } from "@/components/contexts/TeamContext";
import { useRouter } from "next/navigation";
import { useIsContestStarted } from "@/components/contexts/ContestContext";
import Section from "@/components/common/Section";
import useSWR from 'swr';
import { 
  getButtonClasses, 
  getCardClasses, 
  getAlertClasses 
} from "@/lib/ui-utils";

// SWR fetcher function
const fetcher = async () => {
  const result = await getChallenges();
  if (!result.success) {
    throw new Error(result.error || "Failed to load challenges");
  }
  return result;
};

export default function Challenges() {
  const { isAuthenticated, isLoading } = useTeam();
  const isContestStarted = useIsContestStarted();
  const router = useRouter();
  
  // Use SWR for data fetching with automatic caching
  const { data, error, isLoading: isLoadingChallenges, mutate } = useSWR(
    // Only fetch if authenticated and contest started
    isAuthenticated && isContestStarted && !isLoading ? 'challenges' : null,
    fetcher,
    {
      revalidateOnFocus: false, // Don't revalidate when window regains focus
      revalidateOnReconnect: true, // Revalidate when browser regains connection
      refreshInterval: 30000, // Refresh every 30 seconds
      dedupingInterval: 5000, // Deduplicate requests within 5 seconds
    }
  );
  
  const challenges = data?.challengesByCategory || {};
  const categories = data?.categories || [];

  useEffect(() => {
    // Only redirect if we've finished loading auth state
    if (!isLoading) {
      // Check both conditions: user needs to be authenticated AND contest must have started
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to home");
        router.push("/");
      }

      if (!isContestStarted) {
        console.log("Contest not started, redirecting to home");
        router.push("/");
      }
    }
  }, [isAuthenticated, isContestStarted, isLoading, router]);

  if (isLoading || isLoadingChallenges) {
    return (
      <Section id="challenges">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Challenges</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="challenges">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Challenges</h1>
          <div className={getAlertClasses('error')}>
            <p>{error.message || "An error occurred loading challenges"}</p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="challenges">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Challenges</h1>
          <button 
            onClick={() => mutate()} 
            className={getButtonClasses('secondary', 'sm')}
          >
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9"></path>
                <path d="M21 3v9h-9"></path>
              </svg>
              Refresh
            </span>
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {categories.length === 0 ? (
            <div className={getCardClasses('dark', 'lg') + ' text-center'}>
              <p className="text-gray-400">No challenges are available yet.</p>
            </div>
          ) : (
            <div className="space-y-12 pb-8">
              {categories.map((category) => (
                <div key={category} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                    {category}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {challenges[category].map((challenge: any) => (
                      <Link 
                        href={`/challenges/${challenge.id}`}
                        key={challenge.id}
                        className={`group block p-6 rounded-lg border transition duration-200 ${
                          challenge.isSolved 
                            ? "bg-green-900/20 border-green-700 hover:bg-green-900/30" 
                            : "bg-gray-800/50 border-gray-700 hover:bg-gray-800/80"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-medium text-white group-hover:text-white/90">
                            {challenge.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            challenge.isSolved 
                              ? "bg-green-800 text-green-200" 
                              : "bg-purple-800 text-purple-200"
                          }`}>
                            {challenge.points} pts
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {challenge.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-gray-700/50 px-2 py-1 rounded text-gray-300">
                            {challenge.difficulty}
                          </span>
                          
                          {challenge.isSolved && (
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
    </Section>
  );
}
