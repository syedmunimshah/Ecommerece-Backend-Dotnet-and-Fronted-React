import { NextResponse, type NextRequest } from "next/server";
import { createOrder, listMyOrders } from "@/services/order.service";
import { failure, ok, requireToken } from "../_helpers";

export async function GET(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const size = Number(req.nextUrl.searchParams.get("size") ?? 10);
    return ok(await listMyOrders(token, page, size));
  } catch (error) {
    return failure(error);
  }
}

export async function POST() {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    return ok(await createOrder(token), 201);
  } catch (error) {
    return failure(error);
  }
}
