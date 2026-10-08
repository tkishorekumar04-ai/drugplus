import type { Metadata } from "next";
import { ArrowRight, FileCheck2, Globe2, Handshake, Landmark, PackageCheck, Ship } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getMarkets } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { WorldMap } from "@/components/sections/world-map";
import { ContactForm } from "@/components/forms/contact-form";
import { LinkButton } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Pharmaceutical Export & International Partnerships", description: "Source quality Indian pharmaceutical formulations. Regulatory documentation, product registration support and export partnerships.", path: "/export" });
}

const SERVICES = [
  { icon: Globe2, t: "International Supply", d: "Pharmaceutical formulations for importers, distributors and institutions." },
  { icon: Landmark, t: "Regulatory Support", d: "Assistance with documentation required by importing country authorities." },
  { icon: FileCheck2, t: "Documentation", d: "COA, product specifications and supporting technical documents." },
  { icon: PackageCheck, t: "Product Registration", d: "Support with dossier preparation for product registration where applicable." },
  { icon: Ship, t: "Global Distribution", d: "Export-ready packaging and coordination with freight partners." },
  { icon: Handshake, t: "Export Partnerships", d: "Long-term supply relationships built on reliability and transparency." },
];

export default async function ExportPage() {
  const [s, markets] = await Promise.all([getSettings(), getMarkets()]);
  return (
    <>
      <PageHero crumbs={[{ name: "Export", path: "/export" }]} eyebrow="International Business" title="Expanding Healthcare Beyond Borders" description="We work with international partners to supply quality Indian pharmaceutical formulations — with the documentation and support that registration and import require.">
        <div className="mt-8"><LinkButton href="#export-enquiry" variant="secondary" size="lg">Become an International Partner <ArrowRight aria-hidden /></LinkButton></div>
      </PageHero>
      <section className="section bg-white">
        <div className="container">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: I, t, d }, i) => (
              <Reveal as="li" key={t} delay={(i % 3) * 0.05}>
                <div className="h-full rounded-2xl border border-line p-7 shadow-card">
                  <I className="h-8 w-8 text-teal-600" strokeWidth={1.5} aria-hidden />
                  <h2 className="mt-5 text-lg font-bold text-navy-950">{t}</h2>
                  <p className="mt-2 text-ink-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      {markets.length > 0 && (
        <section className="section bg-navy-950 text-white" aria-labelledby="markets-h">
          <div className="container">
            <SectionHeader tone="light" eyebrow="Markets" title={<span id="markets-h">Where we work — and where we are looking for partners</span>} description="Markets we currently serve are highlighted. Regions marked as open to partnership are where we welcome enquiries from importers and distributors." />
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-8">
              <WorldMap markets={markets} />
            </div>
          </div>
        </section>
      )}
      <section id="export-enquiry" className="section bg-surface">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Export Enquiry" title="Become an International Partner" description="Tell us about your market, the products you're interested in and your registration requirements." />
          <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8"><ContactForm source="export-page" defaultType="Export / International" /></div>
        </div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message="Hello, I am interested in an export partnership. Please share product and registration details." title="Let's build an export partnership" text="Share your market and product requirements — our international business team will respond within one business day." />
    </>
  );
}
