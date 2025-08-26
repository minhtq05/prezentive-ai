import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      BETTER_AUTH_SECRET: z.string(),
      RESEND_API_KEY: z.string(),
      BETTER_AUTH_EMAIL: z.email(),
    },
    client: {
      NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      BETTER_AUTH_EMAIL: process.env.BETTER_AUTH_EMAIL,
    },
  });
