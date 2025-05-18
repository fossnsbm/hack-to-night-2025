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

// Email validation function
function isValidEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith('@students.nsbm.ac.lk');
}

export async function register(data: RegisterTeamInput) {
  try {
    // Validate leader email
    if (!isValidEmail(data.email)) {
      return { success: false, error: "Leader email must end with @students.nsbm.ac.lk" };
    }

    // Validate all member emails
    for (const member of data.members) {
      if (member.email && !isValidEmail(member.email)) {
        return { success: false, error: `Email ${member.email} must end with @students.nsbm.ac.lk` };
      }
    }

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
      return { success: false, error: `Email ${data.email} is already registered` };
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

    // Hash the password using argon2
    const hashedPassword = await hashPassword(data.password);

    // First create the leader's member document
    const leaderDoc = await membersRef.add({
      name: data.leaderName,
      email: data.email,
      isLeader: true
    });

    // Create member documents for other team members
    const memberDocs = [];
    if (data.members && data.members.length > 0) {
      const otherMembers = data.members.filter(member => 
        member.email && member.name && member.email !== data.email
      );
      
      if (otherMembers.length > 0) {
        const batch = db.batch();
        
        for (const member of otherMembers) {
          const memberRef = membersRef.doc();
          batch.set(memberRef, {
            name: member.name,
            email: member.email,
            isLeader: false
          });
          memberDocs.push(memberRef);
        }
        
        await batch.commit();
      }
    }

    // Create team with all member references
    const teamData = {
      name: data.teamName,
      leader: leaderDoc.id, // Store leader's document ID
      password: hashedPassword,
      members: [leaderDoc.id, ...memberDocs.map(doc => doc.id)], // Store all member document IDs
      createdAt: new Date()
    };
    
    const teamRef = await teamsRef.add(teamData);

    return { success: true, teamId: teamRef.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register team" };
  }
}
