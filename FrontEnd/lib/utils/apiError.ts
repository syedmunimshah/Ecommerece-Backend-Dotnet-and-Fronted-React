import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const fetchError = error as FetchBaseQueryError;

  // This helper is used by every screen, not just uploads, so the wording here has to make
  // sense on a sign-in form as much as on an image picker — and must not name a localhost
  // port, which is meaningless to anyone using the deployed site.
  if ("status" in fetchError) {
    if (fetchError.status === 413) {
      return "That request is too large. Images must be under 5 MB.";
    }
    if (fetchError.status === 502 || fetchError.status === 503) {
      return "The server is unavailable right now. Please try again in a moment.";
    }
    if (fetchError.status === "FETCH_ERROR" || fetchError.status === "TIMEOUT_ERROR") {
      return "Couldn't reach the server. Check your connection and try again.";
    }
  }

  if (!("data" in fetchError)) {
    return fallback;
  }

  const data = fetchError.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
    if (typeof record.title === "string" && record.title.trim()) {
      return record.title;
    }
  }

  return fallback;
}
