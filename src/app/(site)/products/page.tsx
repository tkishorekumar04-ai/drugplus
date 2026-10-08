import type { Metadata } from "next";
import { Download } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getFilterOptions, searchProducts } from "@/lib/products";
import { PageHero } from "@/components/shared/page-hero";
import { ProductSearch } from "@/components/products/product-search";
import { TrackedLink } from "@/components/shared/tracked-link";
import { FinalCta } from "@/components/sections/final-cta";

type SP = Promise<Record<string, string | string[] | undefined>>;
const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = ["q", "category", "form", "area", "type", "page"].some((k) => sp[k]);
  return buildMetadata({
    title: "Pharmaceutical Products — Tablets, Capsules, Syrups & More",
    description: "Search our pharmaceutical product portfolio by name, composition, category, therapeutic area or dosage form. Available for PCD franchise and distribution partners.",
    path: "/products",
    // Filtered/search result pages canonicalise to /products and are not indexed (avoids thin duplicates)
    noIndex: filtered,
  });
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const filters = { q: str(sp.q).slice(0, 100), category: str(sp.category), form: str(sp.form), area: str(sp.area), type: str(sp.type), page: Math.max(1, Number(str(sp.page)) || 1) };
  const [s, initial, options] = await Promise.all([getSettings(), searchProducts(filters), getFilterOptions()]);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Products", path: "/products" }]}
        eyebrow="Product Catalogue"
        title="Our Pharmaceutical Product Portfolio"
        description="Search by medicine name, composition or brand, and filter by category, therapeutic area or dosage form."
      >
        <TrackedLink
          href={s.catalogueUrl || "/products/catalogue"}
          event="catalogue_download"
          params={{ location: "products-hero" }}
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 font-semibold text-white backdrop-blur transition hover:bg-white/15"
        >
          <Download className="h-4 w-4" aria-hidden /> Download Product Catalogue
        </TrackedLink>
      </PageHero>
      <section className="bg-surface pb-20">
        <div className="container">
          <ProductSearch initial={JSON.parse(JSON.stringify(initial))} initialFilters={filters} options={options} />
        </div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} title="Looking for a specific composition?" text="Share your requirement — our team will confirm availability, packing and franchise terms for your territory." />
    </>
  );
}
