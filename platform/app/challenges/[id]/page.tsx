"use client";

import React, { useState, useEffect } from "react";
import { mockSubmitFlag, mockGetChallenge } from "@/lib/mockData";
import { useTeam } from "@/components/contexts/TeamContext";
import { useRouter } from "next/navigation";
import { useIsContestStarted } from "@/components/contexts/ContestContext";
import Section from "@/components/common/Section";
import useSWR from 'swr';
import { 
  getButtonClasses, 
  getInputClasses, 
  getCardClasses, 
  getAlertClasses 
} from "@/lib/utils";
import { notFound } from 'next/navigation';

type ChallengeType = {
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

interface ChallengeInteractiveContentProps {
  initialChallengeData: {
    challenge?: ChallengeType;
    error?: string;
  };
  challengeId: number;
}

function ChallengeInteractiveContent({ initialChallengeData, challengeId }: ChallengeInteractiveContentProps) {
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);
  
  const { isAuthenticated, isLoading: isLoadingTeam } = useTeam();
  const isContestStarted = useIsContestStarted();
  const router = useRouter();

  const swrKey = isAuthenticated && isContestStarted && !isLoadingTeam && !isNaN(challengeId) 
                 ? `challenge-${challengeId}` 
                 : null;

  const { data, error: swrError, isLoading: isLoadingSWRChallenge, mutate } = useSWR(
    swrKey,
    (key) => (!initialChallengeData.challenge && key) ? mockGetChallenge(challengeId).then(res => res) : Promise.resolve({ challenge: initialChallengeData.challenge, success: true }),
    {
      fallbackData: initialChallengeData.challenge ? { challenge: initialChallengeData.challenge, success: true } : undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 60000, 
      dedupingInterval: 5000,
    }
  );

  const currentChallengeResult = data || (initialChallengeData.challenge ? { challenge: initialChallengeData.challenge, success: true } : { error: initialChallengeData.error, success: false });
  const challengeToDisplay = currentChallengeResult?.challenge as ChallengeType | undefined;
  const displayError = currentChallengeResult?.error || swrError?.message || initialChallengeData.error;
  
  const isLoadingPage = isLoadingTeam || (!challengeToDisplay && !displayError && isLoadingSWRChallenge);

  useEffect(() => {
    if (!isLoadingTeam) {
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
    }
  }, [isAuthenticated, isContestStarted, isLoadingTeam, router, challengeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!flag.trim()) {
      setSubmission({ status: "error", message: "Please enter a flag" });
      return;
    }
    
    setSubmitting(true);
    setSubmission(null);
    
    try {
      const result = await mockSubmitFlag({ challengeId, flag });
      if (result.success) {
        setSubmission({
          status: "success",
          message: result.message || `Correct! You earned ${result.points} points.`
        });
        mutate(
          async (currentSWRData: any) => {
            const updatedChallenge = { ... (currentSWRData?.challenge || challengeToDisplay), isSolved: true };
            return { ...currentSWRData, challenge: updatedChallenge, success: true};
          }, 
          false
        );
        setFlag("");
        setTimeout(() => {
          router.push("/challenges");
        }, 3000);
      } else {
        setSubmission({ status: "error", message: result.error || "Incorrect flag" });
      }
    } catch (err: any) {
      setSubmission({ status: "error", message: err.message || "An error occurred while submitting your flag" });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoadingPage) {
    return (
      <Section id="challenge-details-loading">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Section>
    );
  }

  if (displayError || !challengeToDisplay) {
    return (
      <Section id="challenge-details-error">
        <div className="max-w-4xl mx-auto">
          <div className={getAlertClasses('error')}>
            <p>{displayError || "Challenge data is unavailable."}</p>
          </div>
          <div className="mt-6">
            <button onClick={() => router.push("/challenges")} className={getButtonClasses('secondary')}>
              Back to Challenges
            </button>
          </div>
        </div>
      </Section>
    );
  }
  
  const challenge = challengeToDisplay;

  return (
    <Section id="challenge-details">
      <div className="max-w-4xl mx-auto overflow-y-auto h-full">
        <div className="mb-6">
          <button onClick={() => router.push("/challenges")} className={getButtonClasses('outline', 'sm')}>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Challenges
            </span>
          </button>
        </div>
        
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
                  disabled={submitting || isLoadingPage}
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
        
        <div className={getCardClasses('default', 'lg')}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Solves</h2>
            <button
              onClick={() => mutate()}
              className={getButtonClasses('secondary', 'sm')}
              disabled={isLoadingSWRChallenge}
            >
              {isLoadingSWRChallenge ? 'Refreshing...' : 'Refresh Solves'}
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
interface ChallengePageProps {
  params: { id: string };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const id = params.id;
  const challengeId = parseInt(id, 10);

  let initialDataPayload: ChallengeInteractiveContentProps['initialChallengeData'] = {};

  if (isNaN(challengeId)) {
    notFound();
  }

  try {
    const result = await mockGetChallenge(challengeId);
    if (result.success && result.challenge) {
      initialDataPayload = { challenge: result.challenge as ChallengeType };
    } else {
      if (result.error && result.error.toLowerCase().includes('not found')) {
        notFound();
      }
      initialDataPayload = { error: result.error || "Failed to load challenge from server." };
    }
  } catch (err: any) {
    console.error("Server-side error fetching challenge:", err);
    initialDataPayload = { error: "An unexpected server error occurred." };
  }
  
  return <ChallengeInteractiveContent initialChallengeData={initialDataPayload} challengeId={challengeId} />;
}

