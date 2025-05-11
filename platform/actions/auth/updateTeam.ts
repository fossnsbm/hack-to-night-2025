"use server";

import { db } from "@/lib/db";
import { teams } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "./getSession";
import { revalidatePath } from "next/cache";

type UpdateTeamInput = {
  name?: string;
  password?: string;
};

export async function updateTeam(data: UpdateTeamInput) {
  try {
    const session = await getSession();
    
    if (!session.authenticated || !session.team) {
      return { success: false, error: "Not authenticated" };
    }
    
    // Check if team name already exists (if changing name)
    if (data.name && data.name !== session.team.name) {
      const existingTeam = await db.query.teams.findFirst({
        where: eq(teams.name, data.name)
      });
      
      if (existingTeam) {
        return { success: false, error: "Team name already exists" };
      }
    }
    
    // Update team data
    const updateData: any = {};
    
    if (data.name) {
      updateData.name = data.name;
    }
    
    if (data.password) {
      updateData.password = data.password;
    }
    
    // Don't perform update if no data to update
    if (Object.keys(updateData).length === 0) {
      return { success: true, message: "No changes to update" };
    }
    
    // Update the team
    await db.update(teams)
      .set(updateData)
      .where(eq(teams.id, session.team.id));
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Team update error:", error);
    return { success: false, error: "Failed to update team" };
  }
} 