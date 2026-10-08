import type { CrmProvider } from "./types";

/** WhatsApp Business Cloud API – notifies the sales team about each new lead. */
export const whatsappProvider: CrmProvider = {
  name: "whatsapp",
  enabled: () => Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_NOTIFY_TO),
  async send(lead) {
    const interest = lead.interestedIn || lead.type;
    const template = process.env.WHATSAPP_TEMPLATE_NAME;
    const payload = template
      ? {
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_NOTIFY_TO,
          type: "template",
          template: {
            name: template,
            language: { code: "en" },
            components: [{ type: "body", parameters: [lead.name, lead.phone, interest].map((text) => ({ type: "text", text })) }],
          },
        }
      : {
          messaging_product: "whatsapp",
          to: process.env.WHATSAPP_NOTIFY_TO,
          type: "text",
          text: { body: `New ${interest} enquiry\n${lead.name} · ${lead.phone}\n${[lead.city, lead.state].filter(Boolean).join(", ")}\nForm: ${lead.source}` },
        };
    const res = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`whatsapp ${res.status}`);
  },
};
