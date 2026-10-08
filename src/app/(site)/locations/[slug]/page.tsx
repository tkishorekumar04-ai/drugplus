import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getFranchiseSegments, getTherapeuticAreas } from "@/lib/queries";
import { INDIAN_STATES } from "@/lib/constants";
import { PageHero } from "@/components/shared/page-hero";
import { Markdown } from "@/components/shared/markdown";
import { Faq } from "@/components/shared/faq";
import { LinkButton } from "@/components/ui/button";
import { FranchiseApply } from "@/components/sections/franchise-apply";
import { TherapeuticGrid } from "@/components/sections/therapeutic-grid";
import { WhyChoose } from "@/components/sections/why-choose";

export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  try {
    return (await prisma.location.findMany({ where: { isPublished: true }, select: { slug: true } })).map((l) => ({ slug: l.slug }));
  } catch {
    return [];
  }
}

type Params = Promise<{ slug: string }>;
const getLocation = (slug: string) => prisma.location.findFirst({ where: { slug, isPublished: true } });

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const l = await getLocation((await params).slug);
  if (!l) return {};
  return buildMetadata({ title: l.seoTitle || l.headline || `PCD Pharma Franchise in ${l.name}`, description: l.seoDescription || l.intro, path: `/pharma-franchise-${l.slug}`, absoluteTitle: false });
}

/** Location landing page — only published locations with genuinely local content are served (no doorway pages). */
export default async function LocationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const l = await getLocation(slug);
  if (!l) notFound();
  const [s, segments, areas, nearby] = await Promise.all([
    getSettings(),
    getFranchiseSegments(),
    getTherapeuticAreas(),
    prisma.location.findMany({ where: { isPublished: true, id: { not: l.id } }, select: { name: true, slug: true }, orderBy: { name: "asc" } }),
  ]);
  const faq = (Array.isArray(l.faq) ? l.faq : []) as { q: string; a: string }[];
  const state = INDIAN_STATES.find((x) => x === (l.stateName || l.name));
  const heading = l.headline || `PCD Pharma Franchise in ${l.name}`;

  return (
    <>
      <PageHero
        crumbs={[{ name: "PCD Pharma Franchise", path: "/pcd-pharma-franchise" }, { name: "Locations", path: "/pharma-franchise-locations" }, { name: l.name, path: `/pharma-franchise-${l.slug}` }]}
        eyebrow={l.type === "CITY" ? `${l.name}, ${l.stateName ?? ""}` : `${l.name} · State`}
        title={heading}
        description={l.intro}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="#apply" variant="secondary" size="lg">Check Availability in {l.name} <ArrowRight aria-hidden /></LinkButton>
          <LinkButton href="/products" variant="ghostLight" size="lg">View Products</LinkButton>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="container grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <article>
            <Markdown content={l.content} className="prose-lg" />
          </article>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {l.coverage && (
              <div className="rounded-2xl border border-line bg-surface p-6">
                <p className="flex items-center gap-2 font-bold text-navy-950"><MapPin className="h-4 w-4 text-teal-600" aria-hidden /> Areas we can discuss</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {l.coverage.split(",").map((c) => (
                    <li key={c} className="rounded-full bg-white px-3 py-1 text-sm text-navy-800 ring-1 ring-inset ring-line">{c.trim()}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-subtle">Availability depends on existing partners and is confirmed on enquiry.</p>
              </div>
            )}
            <div className="rounded-2xl bg-navy-900 p-6 text-white">
              <p className="font-bold">Talk to our franchise team</p>
              <p className="mt-1 text-sm text-navy-200">{s.contact.businessHours}</p>
              <LinkButton href="#apply" variant="secondary" className="mt-4 w-full">Apply Now</LinkButton>
            </div>
          </aside>
        </div>
      </section>

      <WhyChoose />

      <section className="section bg-white" aria-labelledby="loc-areas">
        <div className="container">
          <h2 id="loc-areas" className="text-display-md text-navy-950">Ranges available for {l.name} partners</h2>
          <div className="mt-10"><TherapeuticGrid areas={areas.slice(0, 8)} /></div>
        </div>
      </section>

      <FranchiseApply
        title={`Apply for a franchise in ${l.name}`}
        segments={segments}
        phone={s.contact.phone}
        whatsapp={s.contact.whatsapp}
        message={`Hello, I am interested in a PCD Pharma Franchise in ${l.name}. Please share product details and franchise information.`}
        source={`location-${l.slug}`}
        defaultState={state}
        defaultTerritory={l.type === "CITY" ? l.name : ""}
      />

      {(faq.length > 0 || nearby.length > 0) && (
        <section className="section bg-white">
          <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {faq.length > 0 && (
              <div>
                <h2 className="text-display-md text-navy-950">FAQs — {l.name}</h2>
                <div className="mt-8"><Faq items={faq} /></div>
              </div>
            )}
            {nearby.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-navy-950">Other locations</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {nearby.map((n) => (
                    <li key={n.slug}><Link href={`/pharma-franchise-${n.slug}`} className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-navy-900 hover:bg-teal-50">PCD Pharma Franchise in {n.name}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
