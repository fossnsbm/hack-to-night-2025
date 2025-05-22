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
  teamContactNo: string;
};


function isValidEmail(email: string): boolean {
  const emailRegex = /.+@students\.nsbm\.ac\.lk$/;
  return emailRegex.test(email.trim().toLowerCase());
}

export async function register(data: RegisterTeamInput) {
  try {
    
    if (!isValidEmail(data.email)) {
      return { success: false, error: "Leader email must end with @students.nsbm.ac.lk" };
    }

    if (!data.teamContactNo || data.teamContactNo.trim() === '') {
      return { success: false, error: "Team contact number is required" };
    }
    
    const phoneRegex = /^(?:0)?(7[01245678]\d{7})$/;
    if (!phoneRegex.test(data.teamContactNo.trim())) {
      return { success: false, error: "Invalid team contact number format. Use 07XXXXXXXX" };
    }

    
    for (const member of data.members) {
      if (member.email && !isValidEmail(member.email)) {
        return { success: false, error: `Email ${member.email} must end with @students.nsbm.ac.lk` };
      }
    }

    
    const teamsRef = db.collection('teams');
    const teamSnapshot = await teamsRef.where('name', '==', data.teamName).limit(1).get();

    if (!teamSnapshot.empty) {
      return { success: false, error: "Team name already exists" };
    }

    
    const membersRef = db.collection('members');
    const leaderSnapshot = await membersRef.where('email', '==', data.email).limit(1).get();

    if (!leaderSnapshot.empty) {
      return { success: false, error: `Email ${data.email} is already registered` };
    }

    
    if (data.members && data.members.length > 0) {
      const memberEmails = data.members.map(member => member.email).filter(email => email !== data.email);
      
      if (memberEmails.length > 0) {
        for (const email of memberEmails) {
          if (!email) continue; 
          
          const memberSnapshot = await membersRef.where('email', '==', email).limit(1).get();
          
          if (!memberSnapshot.empty) {
            return { success: false, error: `Email ${email} is already registered` };
          }
        }
      }
    }

    
    const submittedMemberEmails = data.members
      .map(member => member.email.trim().toLowerCase())
      .filter(email => email); 

    if (submittedMemberEmails.length > 0) {
      const uniqueSubmittedMemberEmails = new Set(submittedMemberEmails);
      if (submittedMemberEmails.length !== uniqueSubmittedMemberEmails.size) {
        return { success: false, error: "Duplicate member emails are not allowed within the team." };
      }
    }

    
    const hashedPassword = await hashPassword(data.password);

    
    const leaderDoc = await membersRef.add({
      name: data.leaderName,
      email: data.email,
      isLeader: true
    });

    
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

    
    const teamData = {
      name: data.teamName,
      leader: leaderDoc.id, 
      password: hashedPassword,
      members: [leaderDoc.id, ...memberDocs.map(doc => doc.id)], 
      teamContactNo: data.teamContactNo.trim(),
      createdAt: new Date()
    };
    
    const teamRef = await teamsRef.add(teamData);

    return { success: true, teamId: teamRef.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register team" };
  }
}
