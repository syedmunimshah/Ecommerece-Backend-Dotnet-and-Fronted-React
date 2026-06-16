import type { PagedResponse } from "@/types/api";
import { EMPTY_PAGED } from "./normalize";

export async function safeApi<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export function emptyPaged<T>(): PagedResponse<T> {
  return { ...EMPTY_PAGED, Data: [] as T[] };
}
