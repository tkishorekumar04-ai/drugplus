import { cache } from "react";
import { prisma } from "./db";

export type SiteSettings = {
  company: {
    name: string;
    shortName: string;
    legalName: string;
    tagline: string;
    description: string;
    logoUrl: string;
    foundedYear: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    salesEmail: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    businessHours: string;
    mapEmbedUrl: string;
  };
  whatsappMessage: string;
  social: { linkedin: string; facebook: string; instagram: string; youtube: string; x: string };
  hero: { eyebrow: string; headline: string; subheadline: string; imageUrl: string; badges: string[] };
  about: { imageUrl: string; body: string };
  catalogueUrl: string;
  regulatory: { drugLicence: string; gstin: string; cin: string };
  seo: { defaultTitle: string; titleTemplate: string; defaultDescription: string; ogImageUrl: string };
  disclaimer: string;
};

export const defaultSettings: SiteSettings = {
  company: {
    name: "DrugPlus Healthcare",
    shortName: "DrugPlus",
    legalName: "DrugPlus Healthcare Pvt. Ltd.",
    tagline: "Quality Healthcare. Trusted Partnerships. Global Opportunities.",
    description:
      "An Indian pharmaceutical company offering quality-focused formulations, PCD and monopoly pharma franchise opportunities, third-party manufacturing and export partnerships.",
    logoUrl: "",
    foundedYear: "",
  },
  contact: {
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    email: "info@example.com",
    salesEmail: "franchise@example.com",
    address: "Update your registered office address in Admin → Settings",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "",
    businessHours: "Mon – Sat, 9:30 AM – 6:30 PM IST",
    mapEmbedUrl: "",
  },
  whatsappMessage:
    "Hello, I am interested in your PCD Pharma Franchise opportunity. Please share product details and franchise information.",
  social: { linkedin: "", facebook: "", instagram: "", youtube: "", x: "" },
  hero: {
    eyebrow: "PCD Pharma Franchise · Manufacturing · Export",
    headline: "Building Better Healthcare Through Quality, Innovation & Partnership",
    subheadline:
      "We deliver high-quality pharmaceutical solutions while creating sustainable opportunities for franchise partners, distributors and healthcare businesses across India and global markets.",
    imageUrl: "",
    badges: ["Monopoly Rights", "Quality Assured", "Promotional Support", "Pan-India Opportunities"],
  },
  about: { imageUrl: "", body: "" },
  catalogueUrl: "",
  regulatory: { drugLicence: "", gstin: "", cin: "" },
  seo: {
    defaultTitle: "DrugPlus Healthcare — PCD Pharma Franchise & Pharmaceutical Company in India",
    titleTemplate: "%s | DrugPlus Healthcare",
    defaultDescription:
      "Quality pharmaceutical formulations, PCD & monopoly pharma franchise opportunities, third-party manufacturing and export partnerships from DrugPlus Healthcare, India.",
    ogImageUrl: "",
  },
  disclaimer:
    "The information on this website is intended for healthcare professionals, pharmaceutical trade partners and business enquiries. Product information is provided for business reference only and is not medical advice. Prescription medicines must be used only under the supervision of a registered medical practitioner. Product availability, composition and packaging are subject to applicable regulatory approvals.",
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) return (override ?? base) as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined || v === null) continue;
    out[k] = isObject(v) && isObject(out[k]) ? deepMerge(out[k], v) : v;
  }
  return out as T;
}

export const SETTINGS_KEY = "site";

/** Cached per request. Falls back to defaults when the DB is unavailable (e.g. during first build). */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
    return deepMerge(defaultSettings, row?.value ?? {});
  } catch {
    return defaultSettings;
  }
});

export function mergeSettings(override: unknown) {
  return deepMerge(defaultSettings, override);
}
