"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { teams } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const teamId = cookieStore.get("teamId")?.value;
    
    if (!teamId) {
      return { authenticated: false, team: null };
    }
    
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, parseInt(teamId)),
      with: {
        members: true
      }
    });
    
    if (!team) {
      return { authenticated: false, team: null };
    }
    
    return { 
      authenticated: true, 
      team: {
        id: team.id,
        name: team.name,
        leader: team.leader,
        score: team.score,
        members: team.members
      } 
    };
  } catch (error) {
    console.error("Session error:", error);
    return { authenticated: false, team: null };
  }
} 