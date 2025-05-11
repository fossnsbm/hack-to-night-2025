import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { challenges, members, teams } from '../lib/schema';
import { hashPassword } from '../lib/auth';
import { eq } from 'drizzle-orm';

// Load env file explicitly from correct path
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Sample team data
const sampleTeams = [
  {
    name: 'Cyber Dragons',
    password: 'password123',
    score: 350
  },
  {
    name: 'Binary Bandits',
    password: 'password123',
    score: 275
  },
  {
    name: 'Hack Wizards',
    password: 'password123',
    score: 425
  },
  {
    name: 'Digital Phantoms',
    password: 'password123',
    score: 300
  },
  {
    name: 'Code Ninjas',
    password: 'password123',
    score: 500
  }
];

// Sample members data with isLeader flag
const sampleMembers = [
  // Team 1 members
  { name: 'Alex Johnson', email: 'alex@example.com', teamName: 'Cyber Dragons', isLeader: true },
  { name: 'Robin Chen', email: 'robin@example.com', teamName: 'Cyber Dragons', isLeader: false },
  { name: 'Jamie Smith', email: 'jamie@example.com', teamName: 'Cyber Dragons', isLeader: false },
  
  // Team 2 members
  { name: 'Maria Garcia', email: 'maria@example.com', teamName: 'Binary Bandits', isLeader: true },
  { name: 'Elijah Brown', email: 'elijah@example.com', teamName: 'Binary Bandits', isLeader: false },
  { name: 'Sophia Martinez', email: 'sophia@example.com', teamName: 'Binary Bandits', isLeader: false },
  
  // Team 3 members
  { name: 'Sam Wilson', email: 'sam@example.com', teamName: 'Hack Wizards', isLeader: true },
  { name: 'Zoe Mitchell', email: 'zoe@example.com', teamName: 'Hack Wizards', isLeader: false },
  { name: 'Kevin Lee', email: 'kevin@example.com', teamName: 'Hack Wizards', isLeader: false },
  
  // Team 4 members
  { name: 'Taylor Kim', email: 'taylor@example.com', teamName: 'Digital Phantoms', isLeader: true },
  { name: 'Casey Jones', email: 'casey@example.com', teamName: 'Digital Phantoms', isLeader: false },
  { name: 'Morgan Davis', email: 'morgan@example.com', teamName: 'Digital Phantoms', isLeader: false },
  
  // Team 5 members
  { name: 'Jordan Patel', email: 'jordan@example.com', teamName: 'Code Ninjas', isLeader: true },
  { name: 'Riley Thomas', email: 'riley@example.com', teamName: 'Code Ninjas', isLeader: false },
  { name: 'Avery Williams', email: 'avery@example.com', teamName: 'Code Ninjas', isLeader: false }
];

const sampleChallenges = [
  // Web category
  {
    title: 'Cookie Monster',
    description: 'Can you find the secret cookie value that grants admin access?',
    flag: 'flag{c00k13_m0n5t3r_15_h3r3}',
    category: 'Web',
    points: 100
  },
  {
    title: 'Broken Authentication',
    description: 'This login form has a critical security flaw. Can you exploit it?',
    flag: 'flag{1nj3ct10n_w1n5_4g41n}',
    category: 'Web',
    points: 150
  },
  {
    title: 'Hidden API',
    description: 'There\'s a hidden admin API endpoint. Find it and extract the flag.',
    flag: 'flag{h1dd3n_4p1_tr34sur3}',
    category: 'Web',
    points: 200
  },
  
  // Cryptography category
  {
    title: 'Basic Encryption',
    description: 'Decrypt this message: Uqfl{h0s4s1vu_1t_g00e}',
    flag: 'flag{r0t4t1on_1s_c00l}',
    category: 'Cryptography',
    points: 75
  },
  {
    title: 'Hashing It Out',
    description: 'Find the original text that produces this hash: 5f4dcc3b5aa765d61d8327deb882cf99',
    flag: 'flag{p4ssw0rd_cr4ck3d}',
    category: 'Cryptography',
    points: 125
  },
  {
    title: 'RSA Challenge',
    description: 'Can you break this weak RSA implementation and decrypt the flag?',
    flag: 'flag{sm4ll_pr1m3s_4r3_b4d}',
    category: 'Cryptography',
    points: 250
  },
  
  // Forensics category
  {
    title: 'Hidden Data',
    description: 'There\'s a flag hidden in this image. Can you extract it?',
    flag: 'flag{st3g4n0gr4phy_ftw}',
    category: 'Forensics',
    points: 100
  },
  {
    title: 'Packet Inspector',
    description: 'Analyze this network capture file to find the exfiltrated data.',
    flag: 'flag{w1r3sh4rk_sk1llz}',
    category: 'Forensics',
    points: 175
  },
  {
    title: 'Memory Dump',
    description: 'Extract credentials from this memory dump file.',
    flag: 'flag{v0l4t1l1ty_m4st3r}',
    category: 'Forensics',
    points: 225
  },
  
  // Reverse Engineering category
  {
    title: 'Easy Disassembly',
    description: 'Analyze this simple executable to find the password check mechanism.',
    flag: 'flag{r3v3rs1ng_b3g1nn3r}',
    category: 'Reverse Engineering',
    points: 150
  },
  {
    title: 'Crackme Challenge',
    description: 'This binary requires a specific key. Find it by reverse engineering.',
    flag: 'flag{b1n4ry_cr4ck3d_0p3n}',
    category: 'Reverse Engineering',
    points: 200
  },
  {
    title: 'Obfuscation Techniques',
    description: 'This code has been heavily obfuscated. De-obfuscate it to find the flag.',
    flag: 'flag{0bfusc4t10n_d3f34t3d}',
    category: 'Reverse Engineering',
    points: 250
  },
  
  // Miscellaneous category
  {
    title: 'Linux Basics',
    description: 'SSH into this server and navigate to the hidden directory to find the flag.',
    flag: 'flag{b4sh_m4st3ry}',
    category: 'Miscellaneous',
    points: 50
  },
  {
    title: 'OSINT Challenge',
    description: 'Find information about this fictional person online to reveal the flag.',
    flag: 'flag{0p3n_s0urc3_1nt3ll1g3nc3}',
    category: 'Miscellaneous',
    points: 125
  },
  {
    title: 'Regex Riddle',
    description: 'Craft a regular expression that matches these specific patterns.',
    flag: 'flag{r3g3x_w1z4rd}',
    category: 'Miscellaneous',
    points: 100
  }
];

async function seed() {
  const dbUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!dbUrl || !authToken) {
    console.error('Missing database credentials. Ensure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set in .env.local');
    process.exit(1);
  }
  
  console.log('Using database URL:', dbUrl);
  
  const turso = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  // Initialize drizzle
  const db = drizzle(turso);
  
  try {
    console.log('Seeding the database...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(members);
    await db.delete(challenges);
    await db.delete(teams);
    
    // Insert teams with hashed passwords
    console.log('Adding teams...');
    for (const team of sampleTeams) {
      await db.insert(teams).values({
        name: team.name,
        password: hashPassword(team.password),
        score: team.score
      });
    }
    
    // Get team IDs by name
    console.log('Mapping team names to IDs...');
    const teamRecords = await db.select().from(teams);
    const teamMap = new Map(teamRecords.map(team => [team.name, team.id]));
    
    // Insert members with isLeader flag
    console.log('Adding team members...');
    for (const member of sampleMembers) {
      const teamId = teamMap.get(member.teamName);
      
      await db.insert(members).values({
        name: member.name,
        email: member.email,
        teamId: teamId,
        isLeader: member.isLeader
      });
    }
    
    // Insert challenges
    console.log('Adding challenges...');
    await Promise.all(sampleChallenges.map(challenge => db.insert(challenges).values(challenge)));
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    // Close the connection
    await turso.close();
  }
}

// Run the seed function
seed().catch((err) => {
  console.error('Seeding failed!');
  console.error(err);
  process.exit(1);
});