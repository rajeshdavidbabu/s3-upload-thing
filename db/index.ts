import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.server";
import * as schema from "./schema";

const connectionString = env.DATABASE_URL;

// Configure pool settings
const poolConfig = {
  max: 15, // Adjust this based on your database's connection limit
  idle_timeout: 0,
  connect_timeout: 15,
  prepare: false,
};

declare global {
  // eslint-disable-next-line no-var
  var __db__: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  // In production, create a new database instance
  const pool = postgres(connectionString, poolConfig);
  db = drizzle(pool, { schema });
} else {
  // In development, reuse the existing database instance if it exists
  if (!global.__db__) {
    const pool = postgres(connectionString, poolConfig);
    global.__db__ = drizzle(pool, { schema });
  }
  db = global.__db__;
}

export { db };
