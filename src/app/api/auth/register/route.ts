import { Prisma } from "../../../../../generated/account-prisma";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { db } from "~/server/db";
import {
  createSessionToken,
  hashPassword,
  hashSessionToken,
  SESSION_DURATION_MS,
} from "~/server/auth";
import { withSessionCookie } from "~/server/auth-response";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
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
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Enter a valid name, email, and password of at least 8 characters.",
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const [firstName = "", ...lastName] = parsed.data.name.split(/\s+/);
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  try {
    const user = await db.user.create({
      data: {
        email,
        passwordHash: await hashPassword(parsed.data.password),
        profile: {
          create: {
            firstName,
            lastName: lastName.join(" "),
            email,
          },
        },
        sessions: {
          create: {
            tokenHash: hashSessionToken(token),
            expiresAt,
          },
        },
      },
      select: { id: true, email: true },
    });
    return withSessionCookie({ user }, token, expiresAt);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }
    throw error;
  }
}
