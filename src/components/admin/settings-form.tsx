"use client";

import { preservingSubmit } from "@/components/admin/use-preserving-action";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveSettings, type FormState } from "@/lib/admin/actions";
import type { SiteSettings } from "@/lib/settings";
import { MediaInput } from "./media-input";

type F = { k: string; label: string; type?: "text" | "textarea" | "image" | "file" | "lines"; help?: string };

const GROUPS: { title: string; fields: F[] }[] = [
  {
    title: "Company",
    fields: [
      { k: "company.name", label: "Company name" },
      { k: "company.shortName", label: "Short name" },
      { k: "company.legalName", label: "Legal name" },
      { k: "company.tagline", label: "Tagline" },
      { k: "company.description", label: "Short description", type: "textarea" },
      { k: "company.logoUrl", label: "Logo (leave empty for the built-in wordmark)", type: "image" },
    ],
  },
  {
    title: "Contact & WhatsApp",
    fields: [
      { k: "contact.phone", label: "Phone (with country code, e.g. +91 98xxxxxxx)" },
      { k: "contact.whatsapp", label: "WhatsApp number (with country code)" },
      { k: "whatsappMessage", label: "Default WhatsApp message", type: "textarea" },
      { k: "contact.email", label: "Email" },
      { k: "contact.salesEmail", label: "Franchise / sales email" },
      { k: "contact.address", label: "Address", type: "textarea" },
      { k: "contact.city", label: "City" },
      { k: "contact.state", label: "State" },
      { k: "contact.postalCode", label: "PIN code" },
      { k: "contact.businessHours", label: "Business hours" },
      { k: "contact.mapEmbedUrl", label: "Google Maps embed URL", help: "Google Maps → Share → Embed a map → copy the src URL (https://www.google.com/maps/embed?...)" },
    ],
  },
  {
    title: "Homepage",
    fields: [
      { k: "hero.eyebrow", label: "Hero eyebrow" },
      { k: "hero.headline", label: "Hero headline", type: "textarea" },
      { k: "hero.subheadline", label: "Hero supporting copy", type: "textarea" },
      { k: "hero.badges", label: "Hero trust badges (one per line, max 6)", type: "lines", help: "Only list claims the company can substantiate (e.g. WHO-GMP only if certified)." },
      { k: "hero.imageUrl", label: "Hero background photo (optional)", type: "image" },
      { k: "about.imageUrl", label: "About section photo (optional)", type: "image" },
      { k: "about.body", label: "About section text (blank line between paragraphs)", type: "textarea" },
      { k: "catalogueUrl", label: "Product catalogue PDF (optional – otherwise a printable catalogue is generated)", type: "file" },
    ],
  },
  {
    title: "Regulatory & legal",
    fields: [
      { k: "regulatory.drugLicence", label: "Drug licence no." },
      { k: "regulatory.gstin", label: "GSTIN" },
      { k: "regulatory.cin", label: "CIN" },
      { k: "disclaimer", label: "Pharmaceutical disclaimer (footer & disclaimer page)", type: "textarea" },
    ],
  },
  {
    title: "SEO",
    fields: [
      { k: "seo.defaultTitle", label: "Homepage title" },
      { k: "seo.titleTemplate", label: "Title template (%s = page title)" },
      { k: "seo.defaultDescription", label: "Default meta description", type: "textarea" },
      { k: "seo.ogImageUrl", label: "Default social share image (1200×630, optional)", type: "image" },
    ],
  },
  {
    title: "Social profiles",
    fields: [
      { k: "social.linkedin", label: "LinkedIn URL" },
      { k: "social.facebook", label: "Facebook URL" },
      { k: "social.instagram", label: "Instagram URL" },
      { k: "social.youtube", label: "YouTube URL" },
      { k: "social.x", label: "X (Twitter) URL" },
    ],
  },
];

const get = (o: unknown, k: string) => k.split(".").reduce<unknown>((a, p) => (a as Record<string, unknown>)?.[p], o);
const cls = "w-full rounded-xl border border-line bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:border-red-500";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveSettings, undefined);
  return (
    <form onSubmit={preservingSubmit(action)} className="space-y-6">
      {GROUPS.map((g) => (
        <fieldset key={g.title} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <legend className="px-1 text-base font-bold text-navy-950">{g.title}</legend>
          <div className="mt-2 grid gap-4 md:grid-cols-2">
            {g.fields.map((f) => {
              const raw = get(settings, f.k);
              const v = Array.isArray(raw) ? raw.join("\n") : String(raw ?? "");
              const err = state?.fieldErrors?.[f.k];
              const id = `s-${f.k}`;
              return (
                <div key={f.k} className={f.type === "textarea" || f.type === "lines" ? "md:col-span-2" : ""}>
                  <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">{f.label}</label>
                  {f.type === "textarea" || f.type === "lines" ? (
                    <textarea id={id} name={f.k} defaultValue={v} rows={f.type === "lines" ? 4 : 3} className={`${cls} py-2`} aria-invalid={Boolean(err) || undefined} />
                  ) : f.type === "image" || f.type === "file" ? (
                    <MediaInput name={f.k} defaultValue={v} kind={f.type} invalid={Boolean(err)} />
                  ) : (
                    <input id={id} name={f.k} defaultValue={v} className={`${cls} h-10`} aria-invalid={Boolean(err) || undefined} />
                  )}
                  {f.help && <p className="mt-1 text-xs text-ink-subtle">{f.help}</p>}
                  {err && <p className="mt-1 text-xs font-medium text-red-600">{err}</p>}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="sticky bottom-0 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-4 backdrop-blur">
        <button disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white disabled:opacity-60">{pending && <Loader2 className="h-4 w-4 animate-spin" />} Save settings</button>
        {state?.ok && <span role="status" className="text-sm font-medium text-emerald-700">Saved — the website has been updated.</span>}
        {state?.error && <span role="alert" className="text-sm font-medium text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
