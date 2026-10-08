import type { CrmProvider } from "./types";

let cachedToken: { token: string; exp: number } | null = null;

async function zohoAccessToken() {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.token;
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });
  const res = await fetch(`${process.env.ZOHO_ACCOUNTS_URL || "https://accounts.zoho.in"}/oauth/v2/token?${params}`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("zoho token refresh failed");
  cachedToken = { token: data.access_token, exp: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

/** Zoho CRM → Leads module. */
export const zohoProvider: CrmProvider = {
  name: "zoho",
  enabled: () => Boolean(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN),
  async send(lead) {
    const token = await zohoAccessToken();
    const [first, ...rest] = lead.name.split(" ");
    const record = {
      First_Name: first,
      Last_Name: rest.join(" ") || first,
      Phone: lead.phone,
      Email: lead.email ?? undefined,
      City: lead.city ?? undefined,
      State: lead.state ?? undefined,
      Company: lead.businessType ?? "Website enquiry",
      Lead_Source: "Website",
      Description: [`Type: ${lead.type}`, lead.interestedIn && `Interest: ${lead.interestedIn}`, lead.message, `Form: ${lead.source}`, lead.utmCampaign && `Campaign: ${lead.utmCampaign}`]
        .filter(Boolean)
        .join("\n"),
    };
    const res = await fetch(`${process.env.ZOHO_API_DOMAIN || "https://www.zohoapis.in"}/crm/v5/Leads`, {
      method: "POST",
      headers: { Authorization: `Zoho-oauthtoken ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ data: [record] }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`zoho ${res.status}`);
  },
};
