import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Map } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { LinkButton } from "@/components/ui/button";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "PCD Pharma Franchise by State & City", description: "Explore PCD and monopoly pharma franchise opportunities by state and city across India.", path: "/pharma-franchise-locations" });
}

export default async function LocationsHub() {
  const locations = await prisma.location.findMany({ where: { isPublished: true }, orderBy: [{ type: "asc" }, { name: "asc" }] });
  const groups = [
    { title: "States", icon: Map, items: locations.filter((l) => l.type === "STATE") },
    { title: "Cities", icon: Building2, items: locations.filter((l) => l.type === "CITY") },
  ];
  return (
    <>
      <PageHero crumbs={[{ name: "PCD Pharma Franchise", path: "/pcd-pharma-franchise" }, { name: "Locations", path: "/pharma-franchise-locations" }]} eyebrow="Franchise by Location" title="PCD Pharma Franchise Across India" description="Local market information, licensing authorities and territory options for each region. Don't see your area? We welcome enquiries from across India." />
      <section className="section bg-white">
        <div className="container space-y-14">
          {groups.filter((g) => g.items.length).map(({ title, icon: I, items }) => (
            <div key={title}>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-navy-950"><I className="h-6 w-6 text-teal-600" aria-hidden /> {title}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((l) => (
                  <li key={l.id}>
                    <Link href={`/pharma-franchise-${l.slug}`} className="group flex h-full flex-col rounded-2xl border border-line p-6 transition hover:-translate-y-1 hover:shadow-lift">
                      <span className="text-lg font-bold text-navy-950">{l.headline || `PCD Pharma Franchise in ${l.name}`}</span>
                      <span className="mt-2 line-clamp-2 text-sm text-ink-muted">{l.intro}</span>
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600">Explore <ArrowUpRight className="h-4 w-4" aria-hidden /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="rounded-3xl bg-surface p-8 text-center ring-1 ring-inset ring-line">
            <p className="text-xl font-bold text-navy-950">Your territory not listed?</p>
            <p className="mt-2 text-ink-muted">We appoint partners across India — tell us where you operate.</p>
            <LinkButton href="/pcd-pharma-franchise#apply" className="mt-5">Enquire for your area</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
