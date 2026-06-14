import { NextResponse } from "next/server";
import { getPayment } from "@/services/payment.service";
import { failure, ok, requireToken } from "../../_helpers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const { orderId } = await params;
    return ok(await getPayment(token, Number(orderId)));
  } catch (error) {
    return failure(error);
  }
}
