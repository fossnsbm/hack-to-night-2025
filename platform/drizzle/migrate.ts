import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env file explicitly from correct path
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// This script is used to apply migrations to the database
async function main() {
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
  
  // Apply migrations
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle/migrations' });
  console.log('Migrations completed!');
  
  // Close the connection
  await turso.close();
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 