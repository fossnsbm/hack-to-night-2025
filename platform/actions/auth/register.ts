"use server"

import { db } from "@/lib/db";
import { teams, members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth";

type TeamMember = {
  name: string;
  email: string;
};

type RegisterTeamInput = {
  teamName: string;
  leaderName: string;
  email: string;
  password: string;
  members: TeamMember[];
};

export async function register(data: RegisterTeamInput) {
  try {
    // Check if team name already exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.name, data.teamName)
    });

    if (existingTeam) {
      return { success: false, error: "Team name already exists" };
    }

    // Check if leader's email already exists
    const existingMember = await db.query.members.findFirst({
      where: eq(members.email, data.email)
    });

    if (existingMember) {
      return { success: false, error: "Email already registered" };
    }

    // Check if any team member emails are already registered
    if (data.members && data.members.length > 0) {
      const memberEmails = data.members.map(member => member.email).filter(email => email !== data.email);
      
      if (memberEmails.length > 0) {
        for (const email of memberEmails) {
          if (!email) continue; // Skip empty emails
          
          const existingEmail = await db.query.members.findFirst({
            where: eq(members.email, email)
          });
          
          if (existingEmail) {
            return { success: false, error: `Email ${email} is already registered` };
          }
        }
      }
    }

    // Create team with hashed password
    const [team] = await db.insert(teams).values({
      name: data.teamName,
      leader: data.leaderName,
      password: hashPassword(data.password), // Hash the password using our utility
      score: 0,
    }).returning();

    // Create team leader as a member with isLeader flag
    await db.insert(members).values({
      name: data.leaderName,
      email: data.email,
      teamId: team.id,
      isLeader: true,
    });

    // Insert other team members if provided
    if (data.members && data.members.length > 0) {
      const otherMembers = data.members.filter(member => 
        member.email && member.name && member.email !== data.email
      );
      
      if (otherMembers.length > 0) {
        const memberInserts = otherMembers.map(member => ({
          name: member.name,
          email: member.email,
          teamId: team.id,
          isLeader: false, // Set these members as non-leaders
        }));
        
        await db.insert(members).values(memberInserts);
      }
    }

    // No longer setting the session cookie here
    // The user will need to explicitly log in after registration

    revalidatePath("/");
    return { success: true, teamId: team.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register team" };
  }
}
