/** Normalize ASP.NET camelCase JSON to PascalCase DTO keys used in the frontend. */
export function normalizeKeys<T>(input: unknown): T {
  if (input === null || input === undefined) return input as T;
  if (Array.isArray(input)) return input.map((item) => normalizeKeys(item)) as T;
  if (typeof input !== "object") return input as T;

  const obj = input as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[pascalKey] = normalizeKeys(value);
    if (pascalKey !== key) result[key] = value;
  }

  return result as T;
}

export const EMPTY_PAGED = {
  PageNumber: 1,
  PageSize: 10,
  TotalRecords: 0,
  Data: [],
} as const;
