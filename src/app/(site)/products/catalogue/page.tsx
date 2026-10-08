import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";
import { PrintButton } from "@/components/products/print-button";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Product Catalogue", description: "Printable product catalogue: compositions, dosage forms and pack sizes.", path: "/products/catalogue" });
}

/** Printable catalogue (Save as PDF). Upload a designed PDF in Admin → Settings to replace it. */
export default async function CataloguePage() {
  const [s, areas, unassigned] = await Promise.all([
    getSettings(),
    prisma.therapeuticArea.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { status: "PUBLISHED" },
          orderBy: { name: "asc" },
          select: { id: true, name: true, composition: true, packSize: true, categories: { select: { category: { select: { name: true, kind: true } } } } },
        },
      },
    }),
    prisma.product.count({ where: { status: "PUBLISHED", therapeuticAreaId: null } }),
  ]);
  return (
    <section className="bg-white py-12 print:py-0">
      <div className="container max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-700">{s.company.name}</p>
            <h1 className="mt-1 text-3xl font-extrabold text-navy-950">Product Catalogue</h1>
            <p className="mt-1 text-sm text-ink-muted">Updated {formatDate(new Date())} · {s.contact.phone} · {s.contact.email}</p>
          </div>
          <PrintButton label="Download / Save as PDF" name="catalogue" />
        </div>
        {areas.filter((a) => a.products.length).map((a) => (
          <div key={a.id} className="mt-8 break-inside-avoid">
            <h2 className="text-lg font-bold text-navy-950">{a.name}</h2>
            <table className="mt-3 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-surface text-navy-900">
                  <th className="border border-line px-3 py-2 font-semibold">Product</th>
                  <th className="border border-line px-3 py-2 font-semibold">Composition</th>
                  <th className="border border-line px-3 py-2 font-semibold">Form</th>
                  <th className="border border-line px-3 py-2 font-semibold">Pack</th>
                </tr>
              </thead>
              <tbody>
                {a.products.map((p) => (
                  <tr key={p.id}>
                    <td className="border border-line px-3 py-2 font-semibold text-navy-950">{p.name}</td>
                    <td className="border border-line px-3 py-2 text-ink-muted">{p.composition}</td>
                    <td className="border border-line px-3 py-2 text-ink-muted">{p.categories.find((c) => c.category.kind === "DOSAGE_FORM")?.category.name ?? "—"}</td>
                    <td className="border border-line px-3 py-2 text-ink-muted">{p.packSize ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        {unassigned > 0 && <p className="mt-6 text-sm text-ink-subtle">+ {unassigned} additional products — see the online catalogue.</p>}
        <p className="mt-10 text-xs leading-relaxed text-ink-subtle">{s.disclaimer}</p>
      </div>
    </section>
  );
}
