"use server";

import { db } from "@/lib/db";
import { challenges, solves } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "../auth/getSession";

export async function getChallenges() {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session.authenticated) {
      return { success: false, error: "Authentication required" };
    }
    
    // Get all challenges
    const allChallenges = await db.query.challenges.findMany({
      orderBy: (challenges, { asc }) => [asc(challenges.category), asc(challenges.points)]
    });
    
    // Get solved challenges for the current team
    const teamSolves = await db.query.solves.findMany({
      where: eq(solves.teamId, session.team?.id || 0)
    });
    
    const solvedChallengeIds = new Set(teamSolves.map(solve => solve.challengeId));
    
    // Group challenges by category and mark solved ones
    const challengesByCategory: Record<string, any[]> = {};
    
    allChallenges.forEach(challenge => {
      // Don't return the flag in the response
      const { flag, ...safeChallenge } = challenge;
      
      // Add isSolved property
      const enhancedChallenge = {
        ...safeChallenge,
        isSolved: solvedChallengeIds.has(challenge.id)
      };
      
      // Group by category
      if (!challengesByCategory[challenge.category]) {
        challengesByCategory[challenge.category] = [];
      }
      
      challengesByCategory[challenge.category].push(enhancedChallenge);
    });
    
    return { 
      success: true, 
      categories: Object.keys(challengesByCategory),
      challengesByCategory
    };
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return { success: false, error: "Failed to fetch challenges" };
  }
} 