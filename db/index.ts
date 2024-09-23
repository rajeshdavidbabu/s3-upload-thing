import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.server";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL;

// Configure pool settings based on environment
const poolConfig = {
  max: 15, // Pool Size from Supabase config
  idle_timeout: 0, // Disable idle timeout for Transaction mode
  connect_timeout: 15, // 15 seconds connection timeout
  prepare: false,
};

let _db: PostgresJsDatabase<typeof schema> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!_db) {
    const pool = postgres(connectionString, poolConfig);
    _db = drizzle(pool, { schema });
  }
  return _db;
}

export async function closeDbConnection() {
  if (db) {
    await (db as any).pool.end();
    _db = null;
  }
}

// Export for direct usage
export const db = getDb();
