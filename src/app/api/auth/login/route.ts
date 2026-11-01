import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  createSessionToken,
  hashSessionToken,
  SESSION_DURATION_MS,
  verifyPassword,
} from "~/server/auth";
import { withSessionCookie } from "~/server/auth-response";
import { db } from "~/server/db";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true, email: true, passwordHash: true },
  });
  if (
    !user ||
    !(await verifyPassword(parsed.data.password, user.passwordHash))
  ) {
    return NextResponse.json(
      { error: "The email or password is incorrect." },
      { status: 401 },
    );
  }

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId: user.id,
      expiresAt,
    },
  });
  return withSessionCookie(
    { user: { id: user.id, email: user.email } },
    token,
    expiresAt,
  );
}
