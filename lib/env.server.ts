import "server-only";

import zod from "zod";

const envSchema = zod.object({
  DATABASE_URL: zod.string().min(1),
  AUTH_GOOGLE_ID: zod.string().min(1),
  AUTH_GOOGLE_SECRET: zod.string().min(1),
  AUTH_SECRET: zod.string().min(1),
  AWS_ACCESS_KEY_ID: zod.string().min(1),
  AWS_SECRET_ACCESS_KEY: zod.string().min(1),
  AWS_REGION: zod.string().min(1),
  AWS_BUCKET_NAME: zod.string().min(1),
  NODE_ENV: zod.enum(["development", "test", "production"]),
});

export const env = envSchema.parse(process.env);
