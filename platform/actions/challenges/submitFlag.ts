"use server";

import { db } from "@/lib/db";
import { challenges, solves, teams } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "../auth/getSession";
import { revalidatePath } from "next/cache";

type SubmitFlagInput = {
  challengeId: number;
  flag: string;
};

export async function submitFlag(data: SubmitFlagInput) {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session.authenticated || !session.team) {
      return { success: false, error: "Authentication required" };
    }
    
    // Get the challenge
    const challenge = await db.query.challenges.findFirst({
      where: eq(challenges.id, data.challengeId)
    });
    
    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }
    
    // Check if the team has already solved this challenge
    const existingSolve = await db.query.solves.findFirst({
      where: and(
        eq(solves.teamId, session.team.id),
        eq(solves.challengeId, data.challengeId)
      )
    });
    
    if (existingSolve) {
      return { success: false, error: "Challenge already solved" };
    }
    
    // Check if the flag is correct
    if (challenge.flag !== data.flag.trim()) {
      return { success: false, error: "Incorrect flag" };
    }
    
    // Create a solve record
    await db.insert(solves).values({
      teamId: session.team.id,
      challengeId: data.challengeId
    });
    
    // Update the team's score
    await db.update(teams)
      .set({
        score: session.team.score + challenge.points
      })
      .where(eq(teams.id, session.team.id));
    
    revalidatePath("/challenges");
    revalidatePath("/scoreboard");
    
    return { 
      success: true, 
      points: challenge.points,
      message: `Congratulations! You earned ${challenge.points} points.`
    };
  } catch (error) {
    console.error("Error submitting flag:", error);
    return { success: false, error: "Failed to submit flag" };
  }
} 