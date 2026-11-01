import { type NextRequest } from "next/server";

import { clearSessionCookie } from "~/server/auth-response";
import { hashSessionToken, readSessionToken } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  const token = readSessionToken(request.headers.get("cookie"));
  if (token) {
    await db.session.deleteMany({
      where: { tokenHash: hashSessionToken(token) },
    });
  }
  return clearSessionCookie();
}
