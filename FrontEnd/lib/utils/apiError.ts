import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const fetchError = error as FetchBaseQueryError;

  if ("status" in fetchError) {
    if (fetchError.status === 413) {
      return "File is too large. Maximum size is 5 MB.";
    }
    if (fetchError.status === 502) {
      return getApiErrorMessage(fetchError, "Backend is not running. Start the API on http://localhost:5241");
    }
    if (fetchError.status === "FETCH_ERROR") {
      return "Upload failed. Make sure the backend is running on port 5241.";
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
