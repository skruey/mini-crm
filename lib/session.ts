// lib/session.ts

import { NextResponse } from "next/server";

// Simple in-memory session store (resets on server restart)
const sessions = new Map<string, string>();

export function generateSessionId() {
  return Math.random().toString(36).slice(2);
}

export function createSession(userId: string, response: NextResponse) {
  const sessionId = generateSessionId();
  sessions.set(sessionId, userId);
  response.cookies.set("session", sessionId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
    // No maxAge/expires: session cookie (expires on browser close)
  });
  return sessionId;
}

export function getUserIdFromSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  return sessions.get(sessionId) ?? null;
}

export function destroySession(sessionId: string | undefined) {
  if (!sessionId) return;
  sessions.delete(sessionId);
}

export { sessions }; // Only if you need it elsewhere (not in middleware)
