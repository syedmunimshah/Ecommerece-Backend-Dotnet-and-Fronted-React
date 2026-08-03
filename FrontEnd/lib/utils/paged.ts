import type { PagedResponse } from "@/lib/types/api";

/** Backend returns { pageNumber, pageSize, totalRecords, data } — unwrap to array. */
export function unwrapPagedData<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") {
    const r = response as PagedResponse<T> & { Data?: T[] };
    const list = r.data ?? r.Data;
    if (Array.isArray(list)) return list;
  }
  return [];
}

/** Safe array for RTK data that may be paged or already unwrapped. */
export function asArray<T>(value: unknown): T[] {
  return unwrapPagedData<T>(value);
}
