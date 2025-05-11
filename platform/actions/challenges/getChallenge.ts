"use server";

import { db } from "@/lib/db";
import { challenges } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "../auth/getSession";

export async function getChallenge(id: number) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session.authenticated) {
      return { success: false, error: "Authentication required" };
    }
    
    // Get the challenge by ID
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, id),
      with: {
        solves: {
          where: eq(challenges.id, id)
        }
      }
    });
    
    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }
    
    // Check if the team has already solved this challenge
    const isSolved = challenge.solves.some(solve => solve.teamId === session.team?.id);
    
    // Don't return the flag in the response
    const { flag, ...safeChallenge } = challenge;
    
    return { 
      success: true, 
      challenge: { 
        ...safeChallenge,
        isSolved
      } 
    };
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return { success: false, error: "Failed to fetch challenge" };
  }
} 