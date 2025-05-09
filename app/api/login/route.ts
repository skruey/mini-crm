import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db/prisma";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const lowerCaseEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: lowerCaseEmail },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  createSession(user.id, response);

  return response;
}
