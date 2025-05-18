"use server"

import { db } from "@/lib/firebase";
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
    const teamsRef = db.collection('teams');
    const teamSnapshot = await teamsRef.where('name', '==', data.teamName).limit(1).get();

    if (!teamSnapshot.empty) {
      return { success: false, error: "Team name already exists" };
    }

    // Check if leader's email already exists
    const membersRef = db.collection('members');
    const leaderSnapshot = await membersRef.where('email', '==', data.email).limit(1).get();

    if (!leaderSnapshot.empty) {
      return { success: false, error: "Email already registered" };
    }

    // Check if any team member emails are already registered
    if (data.members && data.members.length > 0) {
      const memberEmails = data.members.map(member => member.email).filter(email => email !== data.email);
      
      if (memberEmails.length > 0) {
        for (const email of memberEmails) {
          if (!email) continue; // Skip empty emails
          
          const memberSnapshot = await membersRef.where('email', '==', email).limit(1).get();
          
          if (!memberSnapshot.empty) {
            return { success: false, error: `Email ${email} is already registered` };
          }
        }
      }
    }

    // Collect all member names to store in the team document
    const memberNames = data.members
      .filter(member => member.name && member.email)
      .map(member => member.name);
      
    // Add leader to the members array
    memberNames.unshift(data.leaderName);

    // Hash the password using argon2id
    const hashedPassword = await hashPassword(data.password);

    // Create team with hashed password
    const teamData = {
      name: data.teamName,
      leader: data.leaderName,
      password: hashedPassword,
      members: memberNames,
      createdAt: new Date()
    };
    
    const teamRef = await teamsRef.add(teamData);
    const teamId = teamRef.id;

    // Create team leader as a member
    await membersRef.add({
      name: data.leaderName,
      email: data.email
    });

    // Insert other team members
    if (data.members && data.members.length > 0) {
      const otherMembers = data.members.filter(member => 
        member.email && member.name && member.email !== data.email
      );
      
      if (otherMembers.length > 0) {
        const batch = db.batch();
        
        otherMembers.forEach(member => {
          const memberRef = membersRef.doc();
          batch.set(memberRef, {
            name: member.name,
            email: member.email
          });
        });
        
        await batch.commit();
      }
    }

    return { success: true, teamId: teamId };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register team" };
  }
}
