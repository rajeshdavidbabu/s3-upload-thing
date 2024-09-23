import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({
  path: [".env.local"],
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connectionString = String(process.env.DATABASE_URL);
export const connection = postgres(connectionString, { prepare: false });
export const db = drizzle(connection);

export const migrateDB = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "db/migrations",
    });

    await connection.end();
    console.log("Migration successful");
  } catch (error) {
    console.error("Migration failed", error);
    process.exit(1);
  }
};

migrateDB();
