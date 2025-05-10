// app/api/logout/route.ts

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST(req: Request) {
  // Get the session cookie from the request
  const sessionId = req.cookies.get("session")?.value;

  // Remove from in-memory session store
  destroySession(sessionId);

  // Prepare response and clear the cookie
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
    sameSite: "lax",
  });

  return response;
}
