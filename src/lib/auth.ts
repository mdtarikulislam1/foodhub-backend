// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  apiKey: process.env.BETTER_AUTH_SECRET, 
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_BASE_URL!],
});
