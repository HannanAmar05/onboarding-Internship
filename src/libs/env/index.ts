import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_BASE_URL: z.string().url(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_AUTH_FUSION_ID: z.string().min(1),
  VITE_AUTH_FUSION_TENANT_ID: z.string().min(1),
  VITE_AUTH_FUSION_ISSUER_URL: z.string().url(),
});

export const env = envSchema.parse(import.meta.env);
