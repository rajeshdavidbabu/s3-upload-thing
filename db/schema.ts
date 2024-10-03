import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

// Schema from https://authjs.dev/getting-started/adapters/drizzle
// Don't change
export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

// Schema from https://authjs.dev/getting-started/adapters/drizzle
// Don't change
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
    acceptedAIDataConsent: boolean("accepted_ai_data_consent").default(false),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const files = pgTable("file", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  s3Key: text("s3_key").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userUsage = pgTable("user_usage", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storageUsedBytes: integer("storage_used_bytes").notNull().default(0),
  bandwidthUsedBytes: integer("bandwidth_used_bytes").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
