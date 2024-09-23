import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: [".env.local"],
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in config file");
}

export default {
  schema: "./db/schema.ts",
  dialect: "postgresql",
  out: "./db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
