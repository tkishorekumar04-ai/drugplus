import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const rl = rateLimit(`search:${clientIp(req.headers)}`, 120, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const sp = new URL(req.url).searchParams;
  const result = await searchProducts({
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    form: sp.get("form") ?? undefined,
    area: sp.get("area") ?? undefined,
    type: sp.get("type") ?? undefined,
    page: Number(sp.get("page") || 1),
  });
  return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
