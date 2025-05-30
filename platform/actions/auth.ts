"use server"

import { api, apiQuery } from "@/lib/ctfd";
import { hashPassword, createToken, verifyPassword, verifyToken } from "@/lib/server-utils";
import { validateContestState, ContestState } from "@/lib/contest-utils";

import { UpdateTeamDto } from "@/lib/types";
import { isValidEmail } from "@/lib/common-utils";

type LoginTeamInput = {
    email: string;
    password: string;
};

export async function login(data: LoginTeamInput) {
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Login is not available at this time" 
        };
    }

    if (!(
        data.email &&
        typeof data.email === "string" &&
        data.email.endsWith("@students.nsbm.ac.lk")
    )) {
        return { success: false, error: "Invalid email address" }
    }

    const searchRes = await api({
        path: "/users",
        params: {
            q: data.email,
            field: "email"
        }
    });

    if (searchRes == null) {
        return { success: false, error: "Internal server error" }
    }

    if (searchRes.meta.pagination.total == 0) {
        return { success: false, error: "Invalid email or password" }
    }

    const user = searchRes.data[0]

    if (user.team_id == null) {
        return { success: false, error: "Invalid email or password" }
    }

    const teamRes = await api({
        path: `/teams/${user.team_id}`,
    });

    if (teamRes == null) {
        return { success: false, error: "Invalid email or password" }
    }

    if (await verifyPassword(data.password, teamRes.data.password)) {
        return { success: true, token: await createToken(teamRes.data.id, user.id) }
    }

    return { success: false, error: "Invalid email or password" }
}

type RegisterTeamInput = {
  name: string;
  contactNo: string;
  password: string;
  members: {
      name: string;
      email: string;
  }[];
};

export async function register(data: RegisterTeamInput) {
  try {
    // Validate that registration is open
    const contestValidation = validateContestState([ContestState.REGISTRATION]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Registration is not available at this time" 
        };
    }

    if (!data.contactNo || data.contactNo.trim() === '') {
      return { success: false, error: "Team contact number is required" };
    }
    
    const phoneRegex = /^(?:0)?(7[01245678]\d{7})$/;
    if (!phoneRegex.test(data.contactNo.trim())) {
      return { success: false, error: "Invalid team contact number format. Use 07XXXXXXXX" };
    }
    
    for (const member of data.members) {
      if (member.email && !isValidEmail(member.email)) {
        return { success: false, error: `Email ${member.email} must end with @students.nsbm.ac.lk` };
      }
    }
    
    const teamNameMatches = await apiQuery({
        q: data.name,
        field: "name",
        entity: "teams"
    })

    if (teamNameMatches == null) {
        return { success: false, error: "Internal server error" }
    }

    if (teamNameMatches.length > 0) {
        return { success: false, error: `Team name is already used` }
    }

    const uniqEmails = new Set()

    for (const member of data.members) {
        const matches = await apiQuery({
            q: member.email,
            field: "email",
            entity: "users",
        });

        if (matches == null) {
            return { success: false, error: "Internal server error" }
        }

        if (matches.length > 0) {
            return { success: false, error: `Email ${member.email} is already used` }
        }

        uniqEmails.add(member.email)
    }

    if (uniqEmails.size !== data.members.length) {
        return { success: false, error: `Duplicate member emails are not allowed within the team` }
    }
    
    const teamCreateRes = await api({
        path: "/teams",
        method: "POST",
        body: {
            name: data.name,
            affiliation: data.contactNo,
            password: await hashPassword(data.password),
        }
    });

    if (teamCreateRes == null || !teamCreateRes.success) {
        return { success: false, error: "Internal server error" }
    }

    for (const idx in data.members) {
        const member = data.members[idx];
        const memCreateRes = await api({
            path: "/users",
            method: "POST",
            body: {
                name: member.name,
                email: member.email,
                password: "dummy",
            }
        });

        if (memCreateRes == null || !memCreateRes.success) {
            return { success: false, error: "Internal server error" }
        }

        const memAddRes = await api({
            path: `/teams/${teamCreateRes.data.id}/members`,
            method: "POST",
            body: {
                user_id: memCreateRes.data.id
            }
        })

        if (memAddRes == null || !memAddRes.success) {
            return { success: false, error: "Internal server error" }
        }

        if (idx == "0") {
            const teamPatchRes = await api({
                path: `/teams/${teamCreateRes.data.id}`,
                method: "PATCH",
                body: {
                    captain_id: memCreateRes.data.id
                }
            })

            if (teamPatchRes == null || !teamPatchRes.success) {
                return { success: false, error: "Internal server error" }
            }
        }
    }

    return { success: true, teamId: teamCreateRes.data.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to register team" };
  }
}

export async function updateTeam(token: string, data: UpdateTeamDto) {
    // Validate that contest has started
    const contestValidation = validateContestState([ContestState.STARTED]);
    if (!contestValidation.isValid) {
        return { 
            success: false, 
            error: contestValidation.message || "Team updates are not available at this time" 
        };
    }

    const res = await verifyToken(token);
    if (res) {
        const { tid, uid } = res;
        const teamRes = await api({
            path: `/teams/${tid}`,
        });

        if (teamRes == null || !teamRes.success) {
            console.error(teamRes)
            return { success: false, error: "internal server error" }
        }

        if (uid !== teamRes.data.captain_id) {
            return { success: true, error: "only the leader can update team" }
        }

        if (data.name || (data.currentPassword && data.newPassword)) {
            const patchData: Record<string, string> = {};

            if (data.currentPassword && data.newPassword) {
                if (!(await verifyPassword(data.currentPassword, teamRes.data.password))) {
                    return { success: true, error: "invalid current password" }
                }

                patchData.password = await hashPassword(data.newPassword);
            }

            if (data.name) {
                patchData.name = data.name
            }

            const patchRes = await api({
                path: `/teams/${tid}`,
                method: "PATCH",
                body: patchData
            });

            if (patchRes == null || !patchRes.success) {
                console.error(patchRes)
                return { success: false, error: "internal server error" }
            }
        }
    }

    return { success: false, error: "internal server error" }
}
