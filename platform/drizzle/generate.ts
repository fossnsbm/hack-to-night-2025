import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { migrate } from 'drizzle-orm/libsql/migrator';
import * as schema from '../lib/schema';
import 'dotenv/config';

// This script is used to generate SQL migrations
async function main() {
  console.log('Generating migrations...');
  
  // Create a client to connect to the database
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  
  // Initialize drizzle
  const db = drizzle(turso, { schema });
  
  // Apply migrations
  await migrate(db, { migrationsFolder: 'drizzle/migrations' });
  
  console.log('Migrations generated!');
  await turso.close();
}

main().catch((err) => {
  console.error('Failed to generate migrations!');
  console.error(err);
  process.exit(1);
}); 