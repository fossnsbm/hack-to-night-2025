"use client";

import React, { useState, useEffect } from "react";
import { getChallenge } from "@/actions/challenges/getChallenge";
import { submitFlag } from "@/actions/challenges/submitFlag";
import { useTeam } from "@/contexts/TeamContext";
import { useRouter } from "next/navigation";
import { useIsContestStarted } from "@/contexts/ContestContext";
import Section from "@/components/common/Section";
import useSWR from 'swr';
import { 
  getButtonClasses, 
  getInputClasses, 
  getCardClasses, 
  getAlertClasses 
} from "@/lib/ui-utils";

// Define challenge type
type Challenge = {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  hint?: string;
  isSolved: boolean;
  solves: {
    id: number;
    teamId: number;
    challengeId: number;
    solvedAt: Date;
  }[];
  createdAt: Date;
};

// SWR fetcher function
const challengeFetcher = async (challengeId: number) => {
  const result = await getChallenge(challengeId);
  if (!result.success) {
    throw new Error(result.error || "Failed to load challenge");
  }
  return result;
};

export default function Challenge({ params }: { params: { id: string } }) {
  // Unwrap params with React.use() before accessing properties
  // Cast the result to the expected type
  const unwrappedParams = React.use(params as any) as { id: string };
  const id = unwrappedParams.id;
  
  // Parse the ID once
  const challengeId = parseInt(id);
  
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);
  
  const { isAuthenticated, isLoading } = useTeam();
  const isContestStarted = useIsContestStarted();
  const router = useRouter();

  // Use SWR for data fetching with automatic caching
  const { data, error, isLoading: isLoadingChallenge, mutate } = useSWR(
    // Only fetch if authenticated and contest started and ID is valid
    isAuthenticated && isContestStarted && !isLoading && !isNaN(challengeId) 
      ? `challenge-${challengeId}` 
      : null,
    () => challengeFetcher(challengeId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, // Refresh every 60 seconds
      dedupingInterval: 5000, // Deduplicate requests within 5 seconds
    }
  );

  const challenge = data?.challenge as Challenge | undefined;

  useEffect(() => {
    // Only process after auth state has loaded
    if (!isLoading) {
      // Check both conditions: user needs to be authenticated AND contest must have started
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to home");
        router.push("/");
        return;
      }

      if (!isContestStarted) {
        console.log("Contest not started, redirecting to home");
        router.push("/");
        return;
      }

      // Check if ID is valid
      if (isNaN(challengeId)) {
        console.error("Invalid challenge ID");
        return;
      }
    }
  }, [isAuthenticated, isContestStarted, isLoading, router, challengeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!flag.trim()) {
      setSubmission({
        status: "error",
        message: "Please enter a flag"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmission(null);
      
      const result = await submitFlag({
        challengeId,
        flag
      });
      
      if (result.success) {
        setSubmission({
          status: "success",
          message: result.message || `Correct! You earned ${result.points} points.`
        });
        
        // Update the challenge's solved status locally through SWR
        mutate(
          (current: any) => ({
            ...current,
            challenge: { ...current.challenge, isSolved: true }
          }),
          false // Don't revalidate immediately
        );
        
        // Clear the flag input
        setFlag("");
        
        // Go back to challenges to refresh the list
        setTimeout(() => {
          router.push("/challenges");
        }, 3000);
      } else {
        setSubmission({
          status: "error",
          message: result.error || "Incorrect flag"
        });
      }
    } catch (err) {
      setSubmission({
        status: "error",
        message: "An error occurred while submitting your flag"
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || isLoadingChallenge) {
    return (
      <Section id="challenge-details">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (error || !challenge) {
    return (
      <Section id="challenge-details">
        <div className="max-w-4xl mx-auto">
          <div className={getAlertClasses('error')}>
            <p>{error?.message || "Challenge not found"}</p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => router.push("/challenges")}
              className={getButtonClasses('secondary')}
            >
              Back to Challenges
            </button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="challenge-details">
      <div className="max-w-4xl mx-auto overflow-y-auto h-full">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/challenges")}
            className={getButtonClasses('outline', 'sm')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Challenges
            </span>
          </button>
        </div>
        
        {/* Challenge Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                {challenge.category}
              </div>
              <div className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                {challenge.difficulty}
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                challenge.isSolved
                  ? "bg-green-800 text-green-200"
                  : "bg-purple-800 text-purple-200"
              }`}>
                {challenge.points} pts
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white">{challenge.title}</h1>
          </div>
          
          <div className="flex gap-2">
            {challenge.isSolved && (
              <div className="px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-md text-green-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Solved
              </div>
            )}
          </div>
        </div>
        
        {/* Challenge Content */}
        <div className={getCardClasses('default', 'lg') + ' mb-8'}>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-line">{challenge.description}</p>
          </div>
          
          {challenge.hint && (
            <div className="mt-6 p-4 bg-gray-900/50 border border-yellow-700/30 rounded-md">
              <div className="flex items-center text-yellow-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 8v4M12 16h.01" />
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                </svg>
                <span className="font-medium">Hint</span>
              </div>
              <p className="text-gray-400">{challenge.hint}</p>
            </div>
          )}
        </div>
        
        {/* Flag submission */}
        {!challenge.isSolved ? (
          <div className={getCardClasses('default', 'lg') + ' mb-6'}>
            <h2 className="text-xl font-semibold text-white mb-4">Submit Flag</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="Enter flag here..."
                  className={getInputClasses('dark')}
                  disabled={submitting}
                />
                <button
                  type="submit"
                  className={getButtonClasses('primary', 'lg')}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Flag"}
                </button>
              </div>
              
              {submission && (
                <div className={`mt-4 ${getAlertClasses(submission.status === "success" ? "success" : "error")}`}>
                  {submission.message}
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className={getCardClasses('default', 'lg') + ' mb-6 bg-green-900/20 border-green-700'}>
            <div className="flex items-center gap-2 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="font-medium">You've already solved this challenge!</span>
            </div>
          </div>
        )}
        
        {/* Other team solves */}
        <div className={getCardClasses('default', 'lg')}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Solves</h2>
            <button
              onClick={() => mutate()}
              className={getButtonClasses('secondary', 'sm')}
            >
              Refresh
            </button>
          </div>
          <p className="text-gray-400">
            {challenge.solves?.length || 0} teams have solved this challenge
          </p>
        </div>
      </div>
    </Section>
  );
}
