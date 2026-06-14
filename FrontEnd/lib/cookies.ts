import { env } from "./env";

export const COOKIE_NAME = env.AUTH_COOKIE_NAME ?? "auth_token";
export const COOKIE_MAX_AGE_SECONDS = 2 * 60 * 60;

export const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
