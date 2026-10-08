import "server-only";
import { createHash } from "crypto";

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/**
 * Fixed-window in-memory limiter. Good enough for a single instance / burst protection.
 * Lead submissions are additionally limited per hashed IP against the database (see api/leads),
 * which holds across serverless instances.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return { ok: true, remaining: limit - 1 };
  }
  b.count += 1;
  return { ok: b.count <= limit, remaining: Math.max(0, limit - b.count), retryAfter: Math.ceil((b.reset - now) / 1000) };
}

export function clientIp(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

export function hashIp(ip: string) {
  return createHash("sha256").update(`${process.env.IP_HASH_SALT || "dp"}:${ip}`).digest("hex").slice(0, 32);
}
