"use client";

export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "product_search"
  | "form_start"
  | "form_submit"
  | "generate_lead"
  | "whatsapp_click"
  | "call_click"
  | "catalogue_download"
  | "franchise_enquiry"
  | "contact_enquiry"
  | "document_view";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const META_EVENT: Partial<Record<AnalyticsEvent, string>> = {
  generate_lead: "Lead",
  franchise_enquiry: "SubmitApplication",
  contact_enquiry: "Contact",
  whatsapp_click: "Contact",
  call_click: "Contact",
  product_view: "ViewContent",
  product_search: "Search",
};

/**
 * Single entry point for analytics. Fans out to GTM dataLayer, GA4 (gtag), Meta Pixel,
 * Google Ads conversions and Microsoft Clarity – whichever are configured & consented.
 */
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, ...getUtm() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  window.gtag?.("event", event, payload);
  const metaEvent = META_EVENT[event];
  if (metaEvent) window.fbq?.("track", metaEvent, params);
  else window.fbq?.("trackCustom", event, params);
  window.clarity?.("event", event);
  if (event === "generate_lead" && process.env.NEXT_PUBLIC_GOOGLE_ADS_ID && process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL) {
    window.gtag?.("event", "conversion", { send_to: `${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}/${process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL}` });
  }
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, payload);
}

// ─── UTM / attribution ─────────────────────────────────────────────────────

const UTM_KEY = "dp_attribution";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  landingPage?: string;
  referrer?: string;
};

/** Called once per page load. First-touch landing page; last non-empty UTM set wins. */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const existing = readAttribution();
    const next: Attribution = { ...existing };
    const hasUtm = UTM_FIELDS.some((f) => url.searchParams.get(f));
    if (hasUtm) {
      next.utmSource = url.searchParams.get("utm_source") || undefined;
      next.utmMedium = url.searchParams.get("utm_medium") || undefined;
      next.utmCampaign = url.searchParams.get("utm_campaign") || undefined;
      next.utmTerm = url.searchParams.get("utm_term") || undefined;
      next.utmContent = url.searchParams.get("utm_content") || undefined;
      next.gclid = url.searchParams.get("gclid") || undefined;
    }
    if (!next.landingPage) {
      next.landingPage = url.pathname + url.search;
      if (document.referrer && !document.referrer.startsWith(window.location.origin)) next.referrer = document.referrer;
    }
    sessionStorage.setItem(UTM_KEY, JSON.stringify(next));
    // 30-day first-party cookie so attribution survives across sessions
    if (hasUtm) document.cookie = `${UTM_KEY}=${encodeURIComponent(JSON.stringify(next))}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  } catch {
    /* storage unavailable */
  }
}

export function readAttribution(): Attribution {
  try {
    const s = sessionStorage.getItem(UTM_KEY);
    if (s) return JSON.parse(s);
    const c = document.cookie.split("; ").find((x) => x.startsWith(`${UTM_KEY}=`));
    if (c) return JSON.parse(decodeURIComponent(c.split("=").slice(1).join("=")));
  } catch {
    /* ignore */
  }
  return {};
}

function getUtm() {
  const a = readAttribution();
  return { utm_source: a.utmSource, utm_medium: a.utmMedium, utm_campaign: a.utmCampaign };
}
