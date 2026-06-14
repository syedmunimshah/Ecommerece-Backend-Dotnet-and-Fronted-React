import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/services/category.service";
import { failure, ok, requireToken } from "../../_helpers";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const { id } = await params;
    const body = await req.json();
    return ok(await updateCategory(token, Number(id), body));
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await requireToken();
  if (token instanceof NextResponse) return token;
  try {
    const { id } = await params;
    await deleteCategory(token, Number(id));
    return ok({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
