import { NextResponse, type NextRequest } from "next/server";
import { createCategory, listCategories } from "@/services/category.service";
import { failure, ok, requireToken } from "../_helpers";

export async function GET() {
  try {
    return ok(await listCategories(1, 100));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await createCategory(token, body), 201);
  } catch (error) {
    return failure(error);
  }
}

