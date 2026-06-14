import axios, { AxiosError, type AxiosInstance } from "axios";
import { ApiError } from "@/types/api";

const isServer = typeof window === "undefined";

function attachErrorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (r) => r,
    (error: AxiosError) => {
      const status = error.response?.status ?? 0;
      const data = error.response?.data as { message?: string } | string | undefined;
      const message =
        (typeof data === "object" && data?.message) ||
        (typeof data === "string" && data) ||
        error.message ||
        "Request failed";
      throw new ApiError(status, message, data);
    },
  );
  return instance;
}

/**
 * Server-only axios pointed directly at the .NET backend.
 * Caller must attach `Authorization: Bearer <token>` per-request from cookie.
 * Use only inside Server Components / Route Handlers / Server Actions.
 */
export function makeServerApi(token?: string | null): AxiosInstance {
  if (!isServer) {
    throw new Error("makeServerApi must only be called on the server");
  }
  const instance = axios.create({
    baseURL: process.env.BACKEND_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 15_000,
  });
  return attachErrorInterceptor(instance);
}

/**
 * Client-side axios pointed at /api/bff/*.
 * The BFF route handlers attach the JWT from the HTTP-only cookie.
 */
export const bffApi: AxiosInstance = attachErrorInterceptor(
  axios.create({
    baseURL: "/api/bff",
    headers: { "Content-Type": "application/json" },
    timeout: 15_000,
  }),
);
