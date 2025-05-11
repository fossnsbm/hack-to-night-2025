import { drizzle } from 'drizzle-orm/libsql';
import { turso } from './turso';
import * as schema from './schema';

// Initialize drizzle with the Turso client
export const db = drizzle(turso, { schema });

// Export schema for migrations
export { schema }; 