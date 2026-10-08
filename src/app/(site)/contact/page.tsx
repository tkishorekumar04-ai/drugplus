import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { telLink, whatsappLink } from "@/lib/utils";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { TrackedLink } from "@/components/shared/tracked-link";
import { WhatsAppIcon } from "@/components/shared/social-icons";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return buildMetadata({ title: "Contact Us", description: `Contact ${s.company.name} for PCD pharma franchise, product, manufacturing and export enquiries. Call, WhatsApp or send an enquiry.`, path: "/contact" });
}

export default async function ContactPage() {
  const s = await getSettings();
  const items = [
    { icon: Phone, label: "Phone", value: s.contact.phone, href: telLink(s.contact.phone), event: "call_click" as const },
    { icon: WhatsAppIcon, label: "WhatsApp", value: s.contact.whatsapp, href: whatsappLink(s.contact.whatsapp, s.whatsappMessage), event: "whatsapp_click" as const, external: true },
    { icon: Mail, label: "Email", value: s.contact.email, href: `mailto:${s.contact.email}` },
    ...(s.contact.salesEmail && s.contact.salesEmail !== s.contact.email ? [{ icon: Mail, label: "Franchise enquiries", value: s.contact.salesEmail, href: `mailto:${s.contact.salesEmail}` }] : []),
  ];
  return (
    <>
      <PageHero crumbs={[{ name: "Contact", path: "/contact" }]} eyebrow="Contact Us" title="Let's talk about your pharma business" description="Franchise, products, third-party manufacturing or export — our team responds within one business day." />
      <section className="section bg-surface">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            {items.map(({ icon: I, label, value, href, ...rest }) => {
              const inner = (
                <>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700"><I className="h-5 w-5" /></span>
                  <span><span className="block text-sm text-ink-subtle">{label}</span><span className="block font-bold text-navy-950">{value}</span></span>
                </>
              );
              const cls = "flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:shadow-card";
              return "event" in rest && rest.event ? (
                <TrackedLink key={label} href={href} event={rest.event} params={{ location: "contact-page" }} className={cls} {...("external" in rest ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</TrackedLink>
              ) : (
                <a key={label} href={href} className={cls}>{inner}</a>
              );
            })}
            <div className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700"><MapPin className="h-5 w-5" aria-hidden /></span>
              <address className="not-italic"><span className="block text-sm text-ink-subtle">Address</span><span className="block font-bold text-navy-950">{s.contact.address}</span></address>
            </div>
            <div className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700"><Clock className="h-5 w-5" aria-hidden /></span>
              <span><span className="block text-sm text-ink-subtle">Business hours</span><span className="block font-bold text-navy-950">{s.contact.businessHours}</span></span>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
            <h2 className="text-2xl font-bold text-navy-950">Send us an enquiry</h2>
            <p className="mb-6 mt-1 text-ink-muted">Fields marked * are required.</p>
            <ContactForm />
          </div>
        </div>
        {s.contact.mapEmbedUrl && (
          <div className="container mt-10">
            <iframe title={`Map showing ${s.company.name} location`} src={s.contact.mapEmbedUrl} className="h-[380px] w-full rounded-3xl border border-line" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        )}
      </section>
    </>
  );
}
