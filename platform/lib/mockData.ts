export type Team = {
  id: number;
  name: string;
  leader: string;
  score: number;
  members: {
    id: number;
    name: string;
    email: string;
  }[];
};

export type SessionData = {
  authenticated: boolean;
  team: Team | null;
};

export type LoginResult = {
  success: boolean;
  error?: string;
  team?: {
    name: string;
  };
};

export type LeaderboardTeam = {
  id: number;
  name: string;
  score: number;
  createdAt: Date;
};

export type ActivityNotification = {
  teamName: string;
  challengeTitle: string;
  points: number;
  timestamp: Date;
};

export type UpdateTeamResult = {
  success: boolean;
  error?: string;
};

export async function mockLogin(data: { email: string; password: string }): Promise<LoginResult> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (data.email === "demo@example.com" && data.password === "password") {
    return {
      success: true,
      team: {
        name: "Demo Team"
      }
    };
  }
  
  return {
    success: false,
    error: "Invalid email or password"
  };
}

export async function mockGetSession(): Promise<SessionData> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    authenticated: true,
    team: {
      id: 1,
      name: "Demo Team",
      leader: "demo@example.com",
      score: 1000,
      members: [
        {
          id: 1,
          name: "Demo Leader",
          email: "demo@example.com"
        },
        {
          id: 2,
          name: "Demo Member 1",
          email: "member1@example.com"
        },
        {
          id: 3,
          name: "Demo Member 2",
          email: "member2@example.com"
        }
      ]
    }
  };
}

export async function mockLogout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
}

export async function mockGetLeaderboard(): Promise<LeaderboardTeam[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 1,
      name: "Demo Team",
      score: 1000,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Another Team",
      score: 800,
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Third Team",
      score: 600,
      createdAt: new Date()
    }
  ];
}

export async function mockGetRecentActivity(): Promise<ActivityNotification[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      teamName: "Demo Team",
      challengeTitle: "Web Exploitation 1",
      points: 100,
      timestamp: new Date()
    },
    {
      teamName: "Another Team",
      challengeTitle: "Cryptography 1",
      points: 200,
      timestamp: new Date()
    },
    {
      teamName: "Third Team",
      challengeTitle: "Binary Exploitation 1",
      points: 300,
      timestamp: new Date()
    }
  ];
}

export async function mockUpdateTeam(data: { 
  name?: string; 
  currentPassword?: string; 
  newPassword?: string; 
  members?: { name: string; email: string; }[] 
}): Promise<UpdateTeamResult> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
} 