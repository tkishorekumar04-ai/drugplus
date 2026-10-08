import type { LeadStatus, LeadType, Prisma } from "@prisma/client";
import { LEAD_STATUSES, LEAD_TYPES } from "@/lib/constants";

export type LeadFilterInput = Record<string, string | undefined>;

export function leadWhere(f: LeadFilterInput): Prisma.LeadWhereInput {
  const and: Prisma.LeadWhereInput[] = [];
  const q = f.q?.trim();
  if (q) {
    and.push({
      OR: ["name", "phone", "email", "city", "state", "utmCampaign", "source"].map((k) => ({ [k]: { contains: q, mode: "insensitive" } })),
    });
  }
  if (f.status && LEAD_STATUSES.includes(f.status as LeadStatus)) and.push({ status: f.status as LeadStatus });
  if (f.type && LEAD_TYPES.includes(f.type as LeadType)) and.push({ type: f.type as LeadType });
  if (f.source) and.push({ source: f.source });
  if (f.utm) and.push({ utmSource: f.utm === "(none)" ? null : f.utm });
  if (f.from && !Number.isNaN(Date.parse(f.from))) and.push({ createdAt: { gte: new Date(`${f.from}T00:00:00+05:30`) } });
  if (f.to && !Number.isNaN(Date.parse(f.to))) and.push({ createdAt: { lte: new Date(`${f.to}T23:59:59+05:30`) } });
  return and.length ? { AND: and } : {};
}
