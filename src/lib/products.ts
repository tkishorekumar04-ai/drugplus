import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

export type ProductFilters = {
  q?: string;
  category?: string; // range slug
  form?: string; // dosage form slug
  area?: string; // therapeutic area slug
  type?: string; // product type
  page?: number;
  pageSize?: number;
};

export const productCardSelect = {
  id: true,
  name: true,
  slug: true,
  brand: true,
  composition: true,
  productType: true,
  packSize: true,
  imageUrl: true,
  therapeuticArea: { select: { name: true, slug: true } },
  categories: { select: { category: { select: { name: true, slug: true, kind: true } } } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export function buildProductWhere(f: ProductFilters): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ status: "PUBLISHED" }];
  const q = f.q?.trim().slice(0, 100);
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const t of terms) {
      and.push({
        OR: [
          { name: { contains: t, mode: "insensitive" } },
          { brand: { contains: t, mode: "insensitive" } },
          { composition: { contains: t, mode: "insensitive" } },
          { therapeuticArea: { name: { contains: t, mode: "insensitive" } } },
          { categories: { some: { category: { name: { contains: t, mode: "insensitive" } } } } },
        ],
      });
    }
  }
  if (f.category) and.push({ categories: { some: { category: { slug: f.category } } } });
  if (f.form) and.push({ categories: { some: { category: { slug: f.form } } } });
  if (f.area) and.push({ therapeuticArea: { slug: f.area } });
  if (f.type) and.push({ productType: f.type });
  return { AND: and };
}

export async function searchProducts(f: ProductFilters) {
  const pageSize = Math.min(Math.max(f.pageSize ?? 24, 1), 60);
  const page = Math.max(f.page ?? 1, 1);
  const where = buildProductWhere(f);
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);
  return { items, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getFilterOptions() {
  const [categories, areas, types] = await Promise.all([
    prisma.category.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { name: true, slug: true, kind: true } }),
    prisma.therapeuticArea.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }], select: { name: true, slug: true } }),
    prisma.product.findMany({ where: { status: "PUBLISHED", productType: { not: null } }, distinct: ["productType"], select: { productType: true } }),
  ]);
  return {
    ranges: categories.filter((c) => c.kind === "RANGE"),
    forms: categories.filter((c) => c.kind === "DOSAGE_FORM"),
    areas,
    types: types.map((t) => t.productType!).sort(),
  };
}

export function dosageFormOf(p: Pick<ProductCardData, "categories">) {
  return p.categories.find((c) => c.category.kind === "DOSAGE_FORM")?.category;
}
export function rangeOf(p: Pick<ProductCardData, "categories">) {
  return p.categories.find((c) => c.category.kind === "RANGE")?.category;
}
