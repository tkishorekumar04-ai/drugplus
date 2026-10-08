import { createHmac } from "crypto";
import type { CrmProvider } from "./types";

/** Generic signed webhook (Zapier / Make / n8n / custom backend). */
export const webhookProvider: CrmProvider = {
  name: "webhook",
  enabled: () => Boolean(process.env.LEAD_WEBHOOK_URL),
  async send(lead) {
    const body = JSON.stringify({ event: "lead.created", lead });
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.LEAD_WEBHOOK_SECRET) {
      headers["X-Signature"] = createHmac("sha256", process.env.LEAD_WEBHOOK_SECRET).update(body).digest("hex");
    }
    const res = await fetch(process.env.LEAD_WEBHOOK_URL!, { method: "POST", headers, body, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  },
};
