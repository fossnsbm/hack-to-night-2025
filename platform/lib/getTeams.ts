'use server';
import { turso } from './turso' 

export interface Team {
  rank: number
  teamname: string
  score: number
  image: string
}

export async function getTeams(): Promise<Team[]> {
  /*const result = await turso.execute(`
    SELECT 
      teamname, 
      score, 
      image
    FROM teams
    ORDER BY score DESC
  `)

  const teams: Team[] = result.rows.map((row, index) => ({
    rank: index + 1,
    teamname: row.teamname as string,
    score: row.score as number,
    image: row.image as string,
  }))
*/

    const teams: Team[] = [
        {
        rank: 1,
        teamname: 'Team A',
        score: 100,
        image: '/images/team-a.png',
        },
        {
        rank: 2,
        teamname: 'Team B',
        score: 90,
        image: '/images/team-b.png',
        },
        {
        rank: 3,
        teamname: 'Team C',
        score: 80,
        image: '/images/team-c.png',
        },
        // Add more teams as needed
    ]
  return teams
}
