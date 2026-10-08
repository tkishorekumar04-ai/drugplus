import type { CrmProvider } from "./types";

/** HubSpot private-app token → create (or update) a contact. */
export const hubspotProvider: CrmProvider = {
  name: "hubspot",
  enabled: () => Boolean(process.env.HUBSPOT_ACCESS_TOKEN),
  async send(lead) {
    const [firstname, ...rest] = lead.name.split(" ");
    const properties: Record<string, string> = {
      firstname,
      lastname: rest.join(" ") || "-",
      phone: lead.phone,
      city: lead.city ?? "",
      state: lead.state ?? "",
      hs_lead_status: "NEW",
      message: [`Type: ${lead.type}`, lead.interestedIn && `Interest: ${lead.interestedIn}`, lead.message, `Source: ${lead.source}`]
        .filter(Boolean)
        .join("\n"),
    };
    if (lead.email) properties.email = lead.email;
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
      signal: AbortSignal.timeout(8000),
    });
    // 409 = contact already exists → treat as success
    if (!res.ok && res.status !== 409) throw new Error(`hubspot ${res.status}`);
  },
};
