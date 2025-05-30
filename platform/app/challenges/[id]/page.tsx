"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';

import LoadingSection from '@/components/common/LoadingSection';
import { useAuth } from "@/components/contexts/AuthContext";
import { getButtonClasses, getInputClasses, getCardClasses, getAlertClasses } from "@/lib/client-utils";
import { getChallengeExtended, submitFlag, getDockerStatus, startDockerContainer, stopDockerContainer } from '@/actions/team';
import { ChallengeExtended, DockerContainer } from '@/lib/types';

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
    
    // Docker-related state
    const [dockerContainers, setDockerContainers] = useState<DockerContainer[]>([]);
    const [dockerLoading, setDockerLoading] = useState(false);
    const [dockerError, setDockerError] = useState<string | null>(null);

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

    async function fetchDockerStatus() {
        if (token && challenge?.type === "docker") {
            setDockerLoading(true);
            setDockerError(null);
            try {
                const res = await getDockerStatus(token);
                if (res.success) {
                    // Filter containers for this specific challenge
                    const relevantContainers = res.containers?.filter(container => 
                        container.challenge === challenge.title || 
                        container.docker_image.includes(challenge.title.toLowerCase())
                    ) || [];
                    setDockerContainers(relevantContainers);
                } else {
                    setDockerError(res.error || "Failed to get Docker status");
                    setDockerContainers([]);
                }
            } catch (error: any) {
                setDockerError(error.message || "Failed to get Docker status");
                setDockerContainers([]);
            } finally {
                setDockerLoading(false);
            }
        }
    }

    async function handleStartContainer() {
        if (!token || !challenge) return;
        
        setDockerLoading(true);
        setDockerError(null);
        try {
            // Use the actual Docker image from CTFd challenge data
            if (!challenge.docker_image) {
                setDockerError("No Docker image configured for this challenge");
                return;
            }
            
            const res = await startDockerContainer(token, challenge.id, challenge.docker_image, challenge.title);
            
            if (res.success) {
                // Refresh Docker status after starting
                setTimeout(() => fetchDockerStatus(), 2000);
            } else {
                setDockerError(res.error || "Failed to start container");
            }
        } catch (error: any) {
            setDockerError(error.message || "Failed to start container");
        } finally {
            setDockerLoading(false);
        }
    }

    async function handleStopContainer() {
        if (!token || !challenge) return;
        
        setDockerLoading(true);
        setDockerError(null);
        try {
            if (!challenge.docker_image) {
                setDockerError("No Docker image configured for this challenge");
                return;
            }
            
            const res = await stopDockerContainer(token, challenge.id, challenge.docker_image, challenge.title);
            
            if (res.success) {
                // Refresh Docker status after stopping
                setTimeout(() => fetchDockerStatus(), 1000);
            } else {
                setDockerError(res.error || "Failed to stop container");
            }
        } catch (error: any) {
            setDockerError(error.message || "Failed to stop container");
        } finally {
            setDockerLoading(false);
        }
    }

    useEffect(() => {
        fetchChallenge()
    }, [team]);

    useEffect(() => {
        if (challenge?.type === "docker") {
            fetchDockerStatus();
            // Poll Docker status every 30 seconds
            const interval = setInterval(fetchDockerStatus, 30000);
            return () => clearInterval(interval);
        }
    }, [challenge, token]);

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

                {/* Docker Container Management */}
                {challenge?.type === "docker" && (
                    <div className={getCardClasses('default', 'lg') + ' mb-8'}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-cyan-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M20 7h-3a2 2 0 0 1-2-2V2M9 18v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3"/>
                                    <path d="M3 7.5L7.5 3H14l4 4v4"/>
                                    <path d="M7 13h6"/>
                                    <path d="M7 17h4"/>
                                </svg>
                                <span className="font-medium">Docker Container</span>
                            </div>
                            <button
                                onClick={fetchDockerStatus}
                                className={getButtonClasses('secondary', 'sm')}
                                disabled={dockerLoading}
                            >
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                    </svg>
                                    <span>Refresh</span>
                                </span>
                            </button>
                        </div>

                        {dockerError && (
                            <div className={`mb-4 ${getAlertClasses("error")}`}>
                                {dockerError}
                            </div>
                        )}

                        {dockerContainers.length > 0 ? (
                            <div className="space-y-4">
                                {dockerContainers.map((container) => (
                                    <div key={container.id} className="p-4 bg-gray-900/50 border border-cyan-700/30 rounded-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-green-400 font-medium">Container Running</span>
                                            </div>
                                            <button
                                                onClick={handleStopContainer}
                                                className={getButtonClasses('danger', 'sm')}
                                                disabled={dockerLoading}
                                            >
                                                {dockerLoading ? "Stopping..." : "Stop Container"}
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Host:</span>
                                                <span className="text-white font-mono">{container.host}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Ports:</span>
                                                <span className="text-white font-mono">{container.ports.join(", ")}</span>
                                            </div>
                                            {container.ports.length > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Connection:</span>
                                                    <span className="text-cyan-400 font-mono">
                                                        http://{container.host}:{container.ports[0]}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Auto-stop in:</span>
                                                <span className="text-yellow-400">
                                                    {Math.max(0, Math.floor((container.revert_time - Date.now() / 1000) / 60))} minutes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="text-gray-400 mb-4">No Docker container is currently running for this challenge.</div>
                                <button
                                    onClick={handleStartContainer}
                                    className={getButtonClasses('primary', 'lg')}
                                    disabled={dockerLoading || !team}
                                >
                                    {dockerLoading ? "Starting..." : "Start Docker Container"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

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
