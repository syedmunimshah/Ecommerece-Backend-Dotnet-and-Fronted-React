import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type UploadResult<T> =
  | { data: T }
  | { error: FetchBaseQueryError };

export async function postFileUpload<T>(
  path: string,
  file: File,
  token: string | null,
  parse: (json: unknown) => T,
): Promise<UploadResult<T>> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const text = await response.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      /* plain text error from backend */
    }

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          data,
        },
      };
    }

    return { data: parse(data) };
  } catch {
    return {
      error: {
        status: "FETCH_ERROR",
        error: "Couldn't reach the server. Check your connection and try again.",
      },
    };
  }
}
