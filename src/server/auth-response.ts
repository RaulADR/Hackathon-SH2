import { NextResponse } from "next/server";

import { env } from "~/env";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "~/server/auth";

export function withSessionCookie<T>(
  body: T,
  token: string,
  expiresAt: Date,
): NextResponse<T> {
  const response = NextResponse.json(body);
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_DURATION_MS / 1000,
  });
  return response;
}

export function clearSessionCookie(): NextResponse<{ success: true }> {
  const response = NextResponse.json({ success: true as const });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
