import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://cure-you-backend-production.up.railway.app/api";

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const segment = path.join("/");
  const search = req.nextUrl.search;
  const url = `${BACKEND}/${segment}${search}`;

  const init: RequestInit = { method: req.method };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
    init.headers = { "Content-Type": "application/json" };
  }

  const upstream = await fetch(url, init);
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
