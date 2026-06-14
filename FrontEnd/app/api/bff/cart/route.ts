import { NextResponse, type NextRequest } from "next/server";
import { addToCart, getCart, updateCartItem } from "@/services/cart.service";
import { failure, ok, requireToken } from "../_helpers";

export async function GET() {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    return ok(await getCart(token));
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await addToCart(token, body));
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(req: NextRequest) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const body = await req.json();
    return ok(await updateCartItem(token, body));
  } catch (error) {
    return failure(error);
  }
}
