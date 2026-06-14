import { NextResponse, type NextRequest } from "next/server";
import { createProduct, listProducts } from "@/services/product.service";
import { getServerToken } from "@/lib/jwt";
import { failure, ok, requireToken } from "../_helpers";

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const size = Number(req.nextUrl.searchParams.get("size") ?? 100);
    const token = await getServerToken().catch(() => null);
    return ok(await listProducts(page, size, token));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await createProduct(token, body), 201);
  } catch (error) {
    return failure(error);
  }
}
