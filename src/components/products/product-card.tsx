import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProductCardData } from "@/lib/products";
import { ProductVisual } from "./product-visual";

export function ProductCard({ product }: { product: ProductCardData }) {
  const form = product.categories.find((c) => c.category.kind === "DOSAGE_FORM")?.category;
  const range = product.categories.find((c) => c.category.kind === "RANGE")?.category;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={`${product.name} pack`} fill sizes="(min-width:1280px) 300px, (min-width:768px) 33vw, 100vw" className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <ProductVisual name={product.name} brand={product.brand} form={form?.name} segment={product.therapeuticArea?.name} className="transition duration-500 group-hover:scale-[1.03]" />
        )}
        {form && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-semibold text-navy-800 shadow-sm ring-1 ring-line backdrop-blur">
            {form.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">{product.therapeuticArea?.name ?? range?.name ?? "General Range"}</p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-950">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {product.brand || product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{product.composition}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm">
          <span className="text-ink-subtle">{range?.name ?? product.packSize ?? ""}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-600 transition group-hover:gap-2">
            View Details <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
