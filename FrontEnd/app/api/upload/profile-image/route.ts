import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_API_URL ?? "http://localhost:5241";

async function proxyUpload(request: NextRequest, backendPath: string) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const response = await fetch(`${BACKEND_URL}${backendPath}`, {
      method: "POST",
      headers: { Authorization: auth },
      body: formData,
    });

    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Could not reach the backend API. Start it on http://localhost:5241 and try again.",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  return proxyUpload(request, "/api/user/upload-profile-image");
}

export const runtime = "nodejs";
export const maxDuration = 60;
