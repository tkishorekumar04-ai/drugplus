import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { ProductCardData } from "@/lib/products";
import { SectionHeader } from "@/components/shared/section-header";
import { Icon } from "@/components/shared/icon";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { TrackedLink } from "@/components/shared/tracked-link";
import { Reveal } from "@/components/shared/reveal";

type Cat = { name: string; slug: string; kind: string; icon: string | null; _count: { products: number } };

export function ProductsShowcase({ categories, products, catalogueUrl }: { categories: Cat[]; products: ProductCardData[]; catalogueUrl: string }) {
  const forms = categories.filter((c) => c.kind === "DOSAGE_FORM");
  const ranges = categories.filter((c) => c.kind === "RANGE");
  const href = (c: Cat) => `/products?${c.kind === "DOSAGE_FORM" ? "form" : "category"}=${c.slug}`;
  return (
    <section className="section bg-white" aria-labelledby="products-title">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Product Portfolio" title={<span id="products-title">Our Pharmaceutical Product Portfolio</span>} description="A broad, prescription-ready range across dosage forms and specialities — built for franchise partners and distributors." />
          <div className="flex shrink-0 flex-wrap gap-3">
            <TrackedLink
              href={catalogueUrl || "/products/catalogue"}
              event="catalogue_download"
              params={{ location: "home-products" }}
              {...(catalogueUrl ? { target: "_blank", rel: "noopener", download: true } : {})}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-[0.95rem] font-semibold text-navy-900 transition hover:border-navy-300 hover:bg-navy-50"
            >
              <Download className="h-4 w-4" aria-hidden /> Download Product Catalogue
            </TrackedLink>
            <LinkButton href="/products">View All Products <ArrowRight aria-hidden /></LinkButton>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {[
            { title: "Dosage Forms", items: forms },
            { title: "Speciality Ranges", items: ranges },
          ].map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-ink-subtle">{group.title}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {group.items.map((c) => (
                  <li key={c.slug}>
                    <Link href={href(c)} className="group flex h-full flex-col gap-2 rounded-xl border border-line bg-white p-3.5 transition hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-card">
                      <Icon name={c.icon} className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-semibold leading-tight text-navy-950">{c.name}</span>
                      {c._count.products > 0 && <span className="text-xs text-ink-subtle">{c._count.products} products</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {products.length > 0 && (
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.04} className={i >= 4 ? "hidden sm:block" : undefined}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
