import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_BASE_URL: z.string().url(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_COOKIE_CONSENT: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);
