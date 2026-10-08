import { ArrowRight, Check } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getFranchiseSegments, getFeaturedProducts, getTherapeuticAreas } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { Markdown } from "@/components/shared/markdown";
import { Faq } from "@/components/shared/faq";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { FranchiseApply } from "./franchise-apply";
import { TherapeuticGrid } from "./therapeutic-grid";
import { WhyChoose } from "./why-choose";
import { FinalCta } from "./final-cta";
import { QuickLeadForm } from "@/components/forms/quick-lead-form";
import type { INTEREST_OPTIONS } from "@/lib/constants";

export type LandingConfig = {
  path: string;
  crumb: string;
  eyebrow: string;
  h1: string;
  intro: string;
  highlights: string[];
  body: string; // markdown – unique, useful copy per landing page
  faq: { q: string; a: string }[];
  show: { products?: boolean; areas?: boolean; franchiseForm?: boolean; whyChoose?: boolean };
  interest?: (typeof INTEREST_OPTIONS)[number]["value"];
  cta: { label: string; href: string };
};

/** Shared layout for SEO landing pages; each page supplies its own distinct copy. */
export async function SeoLanding({ c }: { c: LandingConfig }) {
  const [s, segments, products, areas] = await Promise.all([getSettings(), getFranchiseSegments(), getFeaturedProducts(8), getTherapeuticAreas()]);
  return (
    <>
      <PageHero
        crumbs={[{ name: c.crumb, path: c.path }]}
        eyebrow={c.eyebrow}
        title={c.h1}
        description={c.intro}
        aside={
          <div className="rounded-3xl bg-white p-6 text-ink shadow-glow">
            <QuickLeadForm source={`landing${c.path.replace(/\//g, "-")}`} defaultInterest={c.interest} />
          </div>
        }
      >
        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {c.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-[0.95rem] font-medium text-navy-50"><Check className="h-4 w-4 text-teal-300" aria-hidden /> {h}</li>
          ))}
        </ul>
      </PageHero>
      <section className="section bg-white">
        <div className="container max-w-3xl">
          <Markdown content={c.body} className="prose-lg" />
          <LinkButton href={c.cta.href} size="lg" className="mt-8">{c.cta.label} <ArrowRight aria-hidden /></LinkButton>
        </div>
      </section>
      {c.show.whyChoose && <WhyChoose />}
      {c.show.products && products.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-display-md text-navy-950">Featured products</h2>
              <LinkButton href="/products" variant="outline" size="sm">All products</LinkButton>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
          </div>
        </section>
      )}
      {c.show.areas && (
        <section className="section bg-surface">
          <div className="container">
            <h2 className="text-display-md text-navy-950">Therapeutic segments</h2>
            <div className="mt-10"><TherapeuticGrid areas={areas} /></div>
          </div>
        </section>
      )}
      {c.show.franchiseForm && <FranchiseApply segments={segments} phone={s.contact.phone} whatsapp={s.contact.whatsapp} message={s.whatsappMessage} source={`landing${c.path.replace(/\//g, "-")}`} />}
      {c.faq.length > 0 && (
        <section className="section bg-white">
          <div className="container max-w-3xl">
            <h2 className="mb-8 text-display-md text-navy-950">Frequently asked questions</h2>
            <Faq items={c.faq} />
          </div>
        </section>
      )}
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
