import "server-only";
import { cache } from "react";
import { prisma } from "./db";
import { productCardSelect } from "./products";

const publishedProduct = { status: "PUBLISHED" as const };

export const getStats = cache(() =>
  prisma.stat.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, select: { id: true, label: true, value: true, suffix: true } }),
);

export const getTherapeuticAreas = cache(() =>
  prisma.therapeuticArea.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, description: true, icon: true, _count: { select: { products: { where: publishedProduct } } } },
  }),
);

export const getCategories = cache(() =>
  prisma.category.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, kind: true, icon: true, description: true, _count: { select: { products: { where: { product: publishedProduct } } } } },
  }),
);

export const getFeaturedProducts = cache((take = 8) =>
  prisma.product.findMany({ where: { ...publishedProduct, isFeatured: true }, select: productCardSelect, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take }),
);

export const getTestimonials = cache(() =>
  prisma.testimonial.findMany({
    where: { isPublished: true, consentConfirmed: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, quote: true, name: true, role: true, city: true, company: true },
  }),
);

export const getLatestPosts = cache((take = 3) =>
  prisma.blogPost.findMany({
    where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take,
    select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true, category: { select: { name: true, slug: true } } },
  }),
);

/** Only verified AND published documents are ever shown publicly. */
export const getCertificates = cache(() =>
  prisma.certificate.findMany({ where: { isPublished: true, isVerified: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
);

export const getGallery = cache((section?: string) =>
  prisma.galleryImage.findMany({
    where: { isPublished: true, ...(section ? { section } : {}) },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, caption: true, imageUrl: true },
  }),
);

export const getMarkets = cache(() =>
  prisma.exportMarket.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, region: true, status: true, latitude: true, longitude: true },
  }),
);

export const getFranchiseSegments = cache(async () => {
  const [areas, ranges] = await Promise.all([
    prisma.therapeuticArea.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, select: { name: true } }),
    prisma.category.findMany({ where: { isPublished: true, kind: "RANGE" }, orderBy: { sortOrder: "asc" }, select: { name: true } }),
  ]);
  return Array.from(new Set([...ranges.map((r) => r.name), ...areas.map((a) => a.name)]));
});
