"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

import LoadingSection from '@/components/common/LoadingSection';
import { useAuth } from "@/components/contexts/AuthContext";
import { getButtonClasses, getInputClasses, getCardClasses, getAlertClasses } from "@/lib/client-utils";
import { getChallengeExtended, submitFlag } from '@/actions/team';
import { ChallengeExtended } from '@/lib/types';

export default function ChallengePage() {
    const router = useRouter();
    const params = useParams();

    const challengeId = typeof params.id! === "string" ? parseInt(params.id!) : parseInt(params.id![0]);

    const { token, team } = useAuth()

    const [challenge, setChallenge] = useState<ChallengeExtended | null>(null)
    const [flag, setFlag] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submission, setSubmission] = useState<{
        status: "success" | "error";
        message: string;
    } | null>(null);

    async function fetchChallenge() {
        if (token) {
            const res = await getChallengeExtended(token!, challengeId)
            if (res.success) {
                setChallenge(res.challenge!)
            } else {
                alert(res.error)
                setChallenge(null)
            }
        } else {
            setChallenge(null)
        }
    }

    useEffect(() => {
        fetchChallenge()
    }, [team]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!flag.trim()) {
            setSubmission({ status: "error", message: "Please enter a flag" });
            return;
        }

        setSubmitting(true);
        setSubmission(null);

        try {
            const result = await submitFlag(token!, challengeId, flag);
            if (result.success && result.correct) {
                setSubmission({
                    status: "success",
                    message: `Correct! You earned ${challenge!.points} points.`
                });
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

    return (
        <LoadingSection id="challenge-details" loading={challenge == null} >
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
                                {challenge?.category}
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${challenge?.solved
                                ? "bg-green-800 text-green-200"
                                : "bg-purple-800 text-purple-200"
                                }`}>
                                {challenge?.points} pts
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white">{challenge?.title}</h1>
                    </div>

                    <div className="flex gap-2">
                        {challenge?.solved && (
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
                        <p className="text-gray-300 whitespace-pre-line">{challenge?.description}</p>
                    </div>

                    {challenge?.connection_info && (
                        <div className="mt-6 p-4 bg-gray-900/50 border border-blue-700/30 rounded-md">
                            <div className="flex items-center text-blue-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                <span className="font-medium">Connection Info</span>
                            </div>
                            <p className="text-gray-400">{challenge?.connection_info}</p>
                        </div>
                    )}

                    {challenge?.files && challenge?.files.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-900/50 border border-purple-700/30 rounded-md">
                            <div className="flex items-center text-purple-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                    <path d="M13 2v7h7" />
                                </svg>
                                <span className="font-medium">Files</span>
                            </div>
                            <div className="space-y-2">
                                {challenge?.files.map((file, index) => (
                                    <div key={index} className="flex items-center">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch(`/challenges/${challengeId}/download?fileUrl=${encodeURIComponent(file)}`, {
                                                        headers: {
                                                            'Authorization': `Bearer ${token}`
                                                        }
                                                    });

                                                    if (!response.ok) {
                                                        const errorData = await response.json();
                                                        throw new Error(errorData.error || 'Failed to download file');
                                                    }

                                                    const contentDisposition = response.headers.get('content-disposition');
                                                    const filename = contentDisposition?.split('filename=')[1]?.replace(/['"]/g, '') || 'download';

                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);

                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = filename;
                                                    document.body.appendChild(a);
                                                    a.click();

                                                    window.URL.revokeObjectURL(url);
                                                    document.body.removeChild(a);
                                                } catch (error: any) {
                                                    console.error('Error downloading file:', error);
                                                    alert(error.message || 'Failed to download file');
                                                }
                                            }}
                                            className="text-purple-400 hover:text-purple-300 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            Download File {index + 1}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {!challenge?.solved ? (
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
                                    disabled={submitting || team == null}
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
                            className={getButtonClasses('secondary', 'sm')}
                            onClick={fetchChallenge}
                        >
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                </svg>
                                <span>Refresh</span>
                            </span>
                        </button>
                    </div>
                    <p className="text-gray-400">
                        {challenge?.solves ?? 0} teams have solved this challenge
                    </p>
                </div>
            </div>
        </LoadingSection>
    );
}
