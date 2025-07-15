import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { dbLogger } from '../logger';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

dbLogger.info("Initializing database connection");
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { 
  schema,
  logger: {
    logQuery: (query, params) => {
      dbLogger.debug("Query executed", { 
        query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
        paramCount: params?.length || 0
      });
    }
  }
});

export * from './schema';