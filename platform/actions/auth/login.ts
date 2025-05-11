"use server"

import { db } from "@/lib/db";
import { teams, members } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { verifyPassword } from "@/lib/auth";

type LoginInput = {
  email: string;
  password: string;
};

export async function login(data: LoginInput) {
  try {
    console.log(`Attempting login for email: ${data.email}`);
    
    // Trim inputs to prevent whitespace issues
    const email = data.email.trim();
    const password = data.password;
    
    // Find member with matching email
    const member = await db.query.members.findFirst({
      where: eq(members.email, email),
      with: {
        team: true
      }
    });

    // Debug member found
    if (!member) {
      console.log(`No member found with email: ${email}`);
      return { success: false, error: "Invalid email or password" };
    }
    
    if (!member.team) {
      console.log(`Member found but no team associated. Member ID: ${member.id}, Name: ${member.name}`);
      
      // Try to find the team directly
      const teamId = member.teamId;
      if (teamId) {
        console.log(`Trying to find team with ID: ${teamId}`);
        const team = await db.query.teams.findFirst({
          where: eq(teams.id, teamId)
        });
        
        if (team) {
          console.log(`Found team: ${team.name}, comparing password`);
          // Use password verification instead of direct comparison
          if (verifyPassword(password, team.password)) {
            console.log('Password matches, setting session cookie');
            
            // Set cookies for authentication
            const cookieStore = await cookies();
            cookieStore.set({
              name: "teamId",
              value: team.id.toString(),
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60 * 24 * 7, // 1 week
              path: "/",
            });
            
            revalidatePath("/");
            return { 
              success: true, 
              teamId: team.id,
              team: {
                name: team.name
              }
            };
          } else {
            console.log('Password mismatch');
            return { success: false, error: "Invalid email or password" };
          }
        }
      }
      
      return { success: false, error: "Member does not belong to a team" };
    }
    
    console.log(`Member found. ID: ${member.id}, Name: ${member.name}, Team ID: ${member.team.id}, Team Name: ${member.team.name}`);

    // Check if team password matches
    console.log(`Checking password for team: ${member.team.name}`);
    
    // Use password verification instead of direct comparison
    if (!verifyPassword(password, member.team.password)) {
      console.log('Password mismatch');
      return { success: false, error: "Invalid email or password" };
    }
    
    console.log('Password matches, setting session cookie');

    // Set cookies for authentication
    const cookieStore = await cookies();
    cookieStore.set({
      name: "teamId",
      value: member.team.id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    revalidatePath("/");
    return { 
      success: true, 
      teamId: member.team.id,
      team: {
        name: member.team.name
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to log in" };
  }
}
