import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileDown, Info, ShieldAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { productSchema } from "@/lib/jsonld";
import { productCardSelect } from "@/lib/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { Markdown } from "@/components/shared/markdown";
import { TrackView } from "@/components/shared/track-view";
import { TrackedLink } from "@/components/shared/tracked-link";
import { ProductVisual } from "@/components/products/product-visual";
import { ProductCard } from "@/components/products/product-card";
import { PrintButton } from "@/components/products/print-button";
import { ProductEnquiryForm } from "@/components/forms/product-enquiry-form";
import { Badge } from "@/components/ui/badge";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/social-icons";

export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ slug: string }>;

const getProduct = (slug: string) =>
  prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { therapeuticArea: true, categories: { include: { category: true } } },
  });

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seoTitle || `${p.name} (${p.composition})`,
    description: p.seoDescription || `${p.brand || p.name}: ${p.composition}. ${p.packSize ? `Pack: ${p.packSize}. ` : ""}Available for PCD pharma franchise and distribution. Enquire for business details.`,
    path: `/products/${p.slug}`,
    image: p.imageUrl,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [p, s] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p) notFound();

  const form = p.categories.find((c) => c.category.kind === "DOSAGE_FORM")?.category;
  const range = p.categories.find((c) => c.category.kind === "RANGE")?.category;
  const specs = (Array.isArray(p.specifications) ? p.specifications : []) as { label: string; value: string }[];
  const related = await prisma.product.findMany({
    where: { status: "PUBLISHED", id: { not: p.id }, OR: [{ therapeuticAreaId: p.therapeuticAreaId ?? undefined }, { categories: { some: { categoryId: range?.id } } }] },
    select: productCardSelect,
    take: 4,
    orderBy: { isFeatured: "desc" },
  });

  const facts = [
    { label: "Composition", value: p.composition },
    { label: "Dosage Form", value: form?.name },
    { label: "Therapeutic Category", value: p.therapeuticArea?.name },
    { label: "Pack Size", value: p.packSize },
    { label: "Available Strengths", value: p.strengths },
    { label: "Product Type", value: p.productType },
  ].filter((f) => f.value);

  return (
    <>
      <JsonLd data={productSchema({ ...p, category: p.therapeuticArea?.name }, s)} />
      <TrackView event="product_view" params={{ product_id: p.id, product_name: p.name, category: p.therapeuticArea?.name ?? "" }} />
      <div className="border-b border-line bg-surface">
        <div className="container py-4">
          <Breadcrumbs items={[{ name: "Products", path: "/products" }, ...(p.therapeuticArea ? [{ name: p.therapeuticArea.name, path: `/therapeutic-areas/${p.therapeuticArea.slug}` }] : []), { name: p.brand || p.name, path: `/products/${p.slug}` }]} />
        </div>
      </div>

      <section className="bg-white py-10 md:py-14">
        <div className="container grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          <div>
            <div className="grid gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface md:aspect-square">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={`${p.name} pack shot`} fill priority sizes="(min-width:768px) 40vw, 100vw" className="object-contain p-6" />
                ) : (
                  <ProductVisual name={p.name} brand={p.brand} form={form?.name} segment={p.therapeuticArea?.name} />
                )}
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {form && <Badge variant="brand">{form.name}</Badge>}
                  {p.therapeuticArea && <Badge variant="teal">{p.therapeuticArea.name}</Badge>}
                  {p.productType && <Badge>{p.productType}</Badge>}
                </div>
                <h1 className="mt-4 text-display-md text-navy-950">{p.name}</h1>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted">{p.composition}</p>
                <dl className="mt-6 divide-y divide-line rounded-2xl border border-line">
                  {facts.map((f) => (
                    <div key={f.label} className="grid grid-cols-[140px_1fr] gap-3 px-4 py-3 text-sm sm:grid-cols-[170px_1fr]">
                      <dt className="font-semibold text-navy-900">{f.label}</dt>
                      <dd className="text-ink-muted">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#enquire" className="no-print inline-flex h-11 items-center rounded-full bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700 lg:hidden">Enquire About This Product</a>
                  {p.pdfUrl ? (
                    <TrackedLink href={p.pdfUrl} target="_blank" rel="noopener" download event="catalogue_download" params={{ location: "product", product: p.name }} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 font-semibold text-navy-900 hover:bg-navy-50">
                      <FileDown className="h-4 w-4" aria-hidden /> Download Product Information
                    </TrackedLink>
                  ) : (
                    <PrintButton name={p.name} />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-10">
              {p.description && (
                <section aria-labelledby="desc-h">
                  <h2 id="desc-h" className="text-xl font-bold text-navy-950">Product Overview</h2>
                  <Markdown content={p.description} className="mt-3" />
                </section>
              )}
              {p.keyInformation && (
                <section aria-labelledby="key-h">
                  <h2 id="key-h" className="text-xl font-bold text-navy-950">Key Information</h2>
                  <Markdown content={p.keyInformation} className="mt-3" />
                </section>
              )}
              <section aria-labelledby="ind-h">
                <h2 id="ind-h" className="text-xl font-bold text-navy-950">Indications</h2>
                {p.indications ? (
                  <Markdown content={p.indications} className="mt-3" />
                ) : (
                  <p className="mt-3 flex gap-2 rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-muted ring-1 ring-inset ring-line">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                    Prescribing information is available to registered healthcare professionals and trade partners on request.
                  </p>
                )}
              </section>
              {specs.length > 0 && (
                <section aria-labelledby="spec-h">
                  <h2 id="spec-h" className="text-xl font-bold text-navy-950">Product Specifications</h2>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                    <table className="w-full text-left text-sm">
                      <tbody className="divide-y divide-line">
                        {specs.map((r) => (
                          <tr key={r.label} className="even:bg-surface">
                            <th scope="row" className="w-1/3 px-4 py-3 font-semibold text-navy-900">{r.label}</th>
                            <td className="px-4 py-3 text-ink-muted">{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
              <p className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                For use by or on the prescription of a registered medical practitioner only, where applicable. Information on this page is for business reference and is not
                medical advice.
              </p>
            </div>
          </div>

          <aside id="enquire" className="no-print lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-lift">
              <h2 className="text-lg font-bold text-navy-950">Enquire About This Product</h2>
              <p className="mt-1 text-sm text-ink-muted">Get pricing, availability and franchise terms for {p.brand || p.name}.</p>
              <div className="mt-5">
                <ProductEnquiryForm productId={p.id} productName={p.name} />
              </div>
              <TrackedLink
                href={whatsappLink(s.contact.whatsapp, `Hello, I am interested in ${p.name} (${p.composition}). Please share business details.`)}
                target="_blank"
                rel="noopener noreferrer"
                event="whatsapp_click"
                params={{ location: "product", product: p.name }}
                className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 font-semibold text-[#14713B] transition hover:bg-emerald-100"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
              </TrackedLink>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="no-print bg-surface py-16" aria-labelledby="related-h">
          <div className="container">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-h" className="text-2xl font-bold text-navy-950">Related Products</h2>
              <Link href={p.therapeuticArea ? `/products?area=${p.therapeuticArea.slug}` : "/products"} className="text-sm font-semibold text-brand-600 hover:underline">View all</Link>
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => <li key={r.id}><ProductCard product={r} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
