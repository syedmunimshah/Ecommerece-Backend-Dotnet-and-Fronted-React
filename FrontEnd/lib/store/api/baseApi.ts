import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/api/config";
import type { RootState } from "@/lib/store/store";
import { logout } from "@/features/auth/authSlice";

const PUBLIC_AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

function getUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const url = getUrl(args);
    const isPublicAuth = PUBLIC_AUTH_PATHS.some((p) => url.includes(p));

    if (!isPublicAuth) {
      api.dispatch(logout());
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        const redirect = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirect=${redirect}`;
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product", "Category", "Cart", "Order", "Review", "User", "Seller", "Admin", "Role"],
  endpoints: () => ({}),
});
