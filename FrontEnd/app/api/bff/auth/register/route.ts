import { type NextRequest } from "next/server";
import { registerRequest } from "@/services/auth.service";
import { failure, ok } from "../../_helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await registerRequest(body);
    return ok(data, 201);
  } catch (error) {
    return failure(error);
  }
}
