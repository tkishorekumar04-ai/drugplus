import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { leadPayloadSchema } from "@/lib/validation";
import { clientIp, hashIp, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createLead } from "@/lib/leads";
import { syncLeadToCrms } from "@/lib/crm";
import { SITE_URL } from "@/lib/utils";

export const runtime = "nodejs";

const MAX_LEADS_PER_IP_PER_HOUR = 8;

function sameOrigin(req: Request) {
  // CSRF / cross-site abuse guard: browsers always send Origin on POST.
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    return o.host === host || o.origin === new URL(SITE_URL).origin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > 20_000) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  const ip = clientIp(req.headers);
  const burst = rateLimit(`lead:${ip}`, 5, 60_000);
  if (!burst.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429, headers: { "Retry-After": String(burst.retryAfter ?? 60) } });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = leadPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const payload = parsed.data;

  // Bot heuristics: honeypot filled or form submitted inhumanly fast → pretend success, store nothing.
  const tooFast = payload.meta.startedAt && Date.now() - payload.meta.startedAt < 2500;
  if (payload.meta.company_website || tooFast) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(payload.meta.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Verification failed. Please retry the security check." }, { status: 400 });
  }

  const ipHash = hashIp(ip);
  const recent = await prisma.lead.count({ where: { ipHash, createdAt: { gte: new Date(Date.now() - 3_600_000) } } });
  if (recent >= MAX_LEADS_PER_IP_PER_HOUR) {
    return NextResponse.json({ ok: false, error: "We have already received your enquiries. Our team will contact you shortly." }, { status: 429 });
  }

  try {
    const { lead, crmLead } = await createLead(payload, { ipHash, userAgent: req.headers.get("user-agent") });
    after(() => syncLeadToCrms(crmLead));
    return NextResponse.json({ ok: true, id: lead.id, type: lead.type });
  } catch (e) {
    console.error("[leads] create failed", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please call or WhatsApp us." }, { status: 500 });
  }
}
