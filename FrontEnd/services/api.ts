import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { ApiError } from "@/types/api";
import { normalizeKeys } from "@/lib/normalize";

const isServer = typeof window === "undefined";

function normalizeResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  response.data = normalizeKeys<T>(response.data);
  return response;
}

function attachErrorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => normalizeResponse(response),
    (error: AxiosError) => {
      const status = error.response?.status ?? 0;
      const data = error.response?.data as { message?: string } | string | undefined;

      let message =
        (typeof data === "object" && data?.message) ||
        (typeof data === "string" && data) ||
        error.message ||
        "Request failed";

      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        message = "Backend API is not reachable. Start the .NET server at http://localhost:5241";
      }

      throw new ApiError(status, message, data);
    },
  );
  return instance;
}

/**
 * Server-only axios pointed directly at the .NET backend.
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

/** Client-side axios pointed at /api/bff/* */
export const bffApi: AxiosInstance = attachErrorInterceptor(
  axios.create({
    baseURL: "/api/bff",
    headers: { "Content-Type": "application/json" },
    timeout: 15_000,
  }),
);
