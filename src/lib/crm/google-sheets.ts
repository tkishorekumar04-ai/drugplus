import type { CrmProvider } from "./types";

/**
 * Appends a row via a Google Apps Script web app (no service-account keys in the app).
 * See README → "Google Sheets" for the 10-line Apps Script.
 */
export const googleSheetsProvider: CrmProvider = {
  name: "google-sheets",
  enabled: () => Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
  async send(lead) {
    const row = {
      date: lead.createdAt,
      name: lead.name,
      phone: lead.phone,
      email: lead.email ?? "",
      city: lead.city ?? "",
      state: lead.state ?? "",
      type: lead.type,
      businessType: lead.businessType ?? "",
      interestedIn: lead.interestedIn ?? "",
      category: lead.interestedCategory ?? "",
      message: lead.message ?? "",
      source: lead.source,
      utmSource: lead.utmSource ?? "",
      utmMedium: lead.utmMedium ?? "",
      utmCampaign: lead.utmCampaign ?? "",
      landingPage: lead.landingPage ?? "",
      ...lead.extra,
    };
    const res = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`sheets ${res.status}`);
  },
};
