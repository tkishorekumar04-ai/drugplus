import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { productCardSelect } from "@/lib/products";
import { PageHero } from "@/components/shared/page-hero";
import { Markdown } from "@/components/shared/markdown";
import { Icon } from "@/components/shared/icon";
import { ProductCard } from "@/components/products/product-card";
import { LinkButton } from "@/components/ui/button";
import { FinalCta } from "@/components/sections/final-cta";

export const revalidate = 600;
export async function generateStaticParams() {
  try {
    return (await prisma.therapeuticArea.findMany({ where: { isPublished: true }, select: { slug: true } })).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

type Params = Promise<{ slug: string }>;
const getArea = (slug: string) => prisma.therapeuticArea.findFirst({ where: { slug, isPublished: true } });

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const a = await getArea((await params).slug);
  if (!a) return {};
  return buildMetadata({ title: a.seoTitle || `${a.name} Range — PCD Pharma Franchise`, description: a.seoDescription || a.description || undefined, path: `/therapeutic-areas/${a.slug}` });
}

export default async function AreaPage({ params }: { params: Params }) {
  const a = await getArea((await params).slug);
  if (!a) notFound();
  const [s, products] = await Promise.all([
    getSettings(),
    prisma.product.findMany({ where: { status: "PUBLISHED", therapeuticAreaId: a.id }, select: productCardSelect, orderBy: [{ isFeatured: "desc" }, { name: "asc" }], take: 24 }),
  ]);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Therapeutic Areas", path: "/therapeutic-areas" }, { name: a.name, path: `/therapeutic-areas/${a.slug}` }]}
        eyebrow="Therapeutic Area"
        title={`${a.name} Range`}
        description={a.description}
        aside={<div className="hidden justify-end lg:flex"><span className="grid h-40 w-40 place-items-center rounded-[2.5rem] bg-white/10 ring-1 ring-white/20 backdrop-blur"><Icon name={a.icon} className="h-20 w-20 text-teal-300" strokeWidth={1.1} /></span></div>}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/pcd-pharma-franchise#apply" variant="secondary" size="lg">Enquire for {a.name} Franchise <ArrowRight aria-hidden /></LinkButton>
        </div>
      </PageHero>
      {a.content && (
        <section className="bg-white py-14"><div className="container max-w-3xl"><Markdown content={a.content} /></div></section>
      )}
      <section className="section bg-surface">
        <div className="container">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-display-md text-navy-950">{a.name} Products</h2>
            <LinkButton href={`/products?area=${a.slug}`} variant="outline" size="sm">Search & filter</LinkButton>
          </div>
          {products.length ? (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
            </ul>
          ) : (
            <p className="mt-8 text-ink-muted">Products for this segment will be listed soon. Contact us for the current range.</p>
          )}
        </div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
