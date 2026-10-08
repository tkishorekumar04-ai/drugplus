import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { leadWhere } from "@/lib/admin/lead-filters";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Escape a CSV cell and neutralise spreadsheet formula injection. */
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const leads = await prisma.lead.findMany({
    where: leadWhere(params),
    orderBy: { createdAt: "desc" },
    take: 50_000,
    include: { franchiseEnquiry: true, contactEnquiry: true, product: { select: { name: true } } },
  });
  const header = [
    "Date", "Time", "Name", "Phone", "Email", "City", "State", "Type", "Status", "Business Type", "Interested In", "Interested Category",
    "Preferred Territory", "Business Experience", "Investment Range", "Product", "Message", "Source", "UTM Source", "UTM Medium", "UTM Campaign",
    "UTM Term", "UTM Content", "GCLID", "Landing Page", "Page URL", "Referrer", "Notes", "Lead ID",
  ];
  const rows = leads.map((l) => [
    formatDate(l.createdAt, { dateStyle: "short" }),
    formatDate(l.createdAt, { timeStyle: "short" }),
    l.name, l.phone, l.email, l.city, l.state, l.type, l.status, l.businessType, l.interestedIn, l.interestedCategory,
    l.franchiseEnquiry?.preferredTerritory, l.franchiseEnquiry?.businessExperience, l.franchiseEnquiry?.investmentRange, l.product?.name,
    l.message ?? l.contactEnquiry?.message, l.source, l.utmSource, l.utmMedium, l.utmCampaign, l.utmTerm, l.utmContent, l.gclid,
    l.landingPage, l.pageUrl, l.referrer, l.notes, l.id,
  ]);
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
