'use server';

import { db } from '@/lib/db';
import { teams, solves, challenges } from '@/lib/schema';
import { desc, eq, sql, count } from 'drizzle-orm';
import { type InferSelectModel } from 'drizzle-orm';

// Define Team type based on the teams table
type Team = InferSelectModel<typeof teams>;

// Define LeaderboardTeam type for the leaderboard function return
type LeaderboardTeam = {
  id: number;
  name: string;
  score: number;
  createdAt: Date;
};

/**
 * Get all teams sorted by score for the leaderboard
 */
export async function getLeaderboard(): Promise<LeaderboardTeam[]> {
  try {
    const leaderboardData = await db.query.teams.findMany({
      orderBy: [
        desc(teams.score),
        teams.createdAt
      ],
      columns: {
        id: true,
        name: true,
        score: true,
        createdAt: true
      }
    });
    
    return leaderboardData;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Get detailed team statistics including number of solves
 */
export async function getTeamStats(teamId: number) {
  try {
    // Get basic team info
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
      columns: {
        id: true,
        name: true,
        score: true,
        createdAt: true
      }
    });
    
    if (!team) {
      return null;
    }
    
    // Get solve count
    const solvesCount = await db.select({ 
      count: count()
    })
    .from(solves)
    .where(eq(solves.teamId, teamId));
    
    // Get last solve time
    const lastSolve = await db.query.solves.findFirst({
      where: eq(solves.teamId, teamId),
      orderBy: [desc(solves.solvedAt)],
      columns: {
        solvedAt: true
      },
      with: {
        challenge: {
          columns: {
            title: true,
            points: true
          }
        }
      }
    });
    
    return {
      ...team,
      solveCount: solvesCount[0]?.count || 0,
      lastSolve: lastSolve ? {
        time: lastSolve.solvedAt,
        challenge: lastSolve.challenge.title,
        points: lastSolve.challenge.points
      } : null
    };
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return null;
  }
}

/**
 * Get recent solves for the activity feed
 */
export async function getRecentActivity(limit: number = 10) {
  try {
    const recentSolves = await db.query.solves.findMany({
      orderBy: [desc(solves.solvedAt)],
      limit,
      with: {
        team: {
          columns: {
            name: true
          }
        },
        challenge: {
          columns: {
            title: true,
            points: true
          }
        }
      }
    });
    
    return recentSolves.map(solve => ({
      teamName: solve.team.name,
      challengeTitle: solve.challenge.title,
      points: solve.challenge.points,
      timestamp: solve.solvedAt
    }));
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
} 