import { z } from "zod";

const serverSchema = z.object({
  BACKEND_API_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  AUTH_COOKIE_NAME: z.string().default("auth_token"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const parsedServer = serverSchema.safeParse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
});

if (typeof window === "undefined" && !parsedServer.success) {
  console.error(
    "Invalid server environment variables:",
    parsedServer.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server environment variables. See .env.local.example");
}

const parsedPublic = publicSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export const env = {
  ...(parsedServer.success ? parsedServer.data : ({} as z.infer<typeof serverSchema>)),
  ...parsedPublic,
};
