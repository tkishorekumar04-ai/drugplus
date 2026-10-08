import "server-only";
import { prisma } from "../db";
import type { CrmLead, CrmProvider } from "./types";
import { webhookProvider } from "./webhook";
import { googleSheetsProvider } from "./google-sheets";
import { hubspotProvider } from "./hubspot";
import { zohoProvider } from "./zoho";
import { whatsappProvider } from "./whatsapp";

export const crmProviders: CrmProvider[] = [webhookProvider, googleSheetsProvider, hubspotProvider, zohoProvider, whatsappProvider];

export function enabledCrmProviders() {
  return crmProviders.filter((p) => p.enabled());
}

/**
 * Fan a stored lead out to every configured CRM. Never throws – the lead is already safely
 * stored in Postgres; failures are recorded on the lead so they can be retried from the admin.
 */
export async function syncLeadToCrms(lead: CrmLead) {
  const providers = enabledCrmProviders();
  if (!providers.length) return;
  const results = await Promise.allSettled(providers.map((p) => p.send(lead)));
  const errors = results
    .map((r, i) => (r.status === "rejected" ? `${providers[i].name}: ${(r.reason as Error)?.message ?? r.reason}` : null))
    .filter(Boolean);
  await prisma.lead
    .update({
      where: { id: lead.id },
      data: { crmSyncedAt: new Date(), crmSyncError: errors.length ? errors.join("; ").slice(0, 500) : null },
    })
    .catch(() => undefined);
}

export type { CrmLead };
