import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateStreamToken } from "@/lib/stream";

// Simple in-memory rate limit: 20 req/min per user (serverless-friendly best-effort)
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX = 20;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX;
}

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isRateLimited(userId)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429, headers: { "Retry-After": "60" } });
  }

  try {
    const token = await generateStreamToken(userId);
    if (!token) throw new Error("Token generation returned empty");
    return NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[api/chat/token] failed", e);
    // Don't leak internal error details
    return NextResponse.json({ error: "Failed to generate token. Check STREAM credentials." }, { status: 500 });
  }
}
