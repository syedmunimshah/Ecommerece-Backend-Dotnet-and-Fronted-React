import "server-only";
import { NextResponse } from "next/server";
import { ApiError } from "@/types/api";
import { getServerToken } from "@/lib/jwt";

export async function requireToken(): Promise<string | NextResponse> {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return token;
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function failure(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, details: error.details },
      { status: error.status || 500 },
    );
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ message }, { status: 500 });
}
