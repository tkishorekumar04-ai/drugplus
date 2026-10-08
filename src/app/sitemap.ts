import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { LEGAL } from "@/lib/legal";
import { LANDING } from "@/lib/landing-pages";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: absoluteUrl("/pcd-pharma-franchise"), changeFrequency: "weekly", priority: 0.95, lastModified: now },
    { url: absoluteUrl("/products"), changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: absoluteUrl("/therapeutic-areas"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/quality"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/export"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/certifications"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/pharma-franchise-locations"), changeFrequency: "monthly", priority: 0.7 },
    ...Object.values(LANDING).map((l) => ({ url: absoluteUrl(l.path), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...Object.keys(LEGAL).map((k) => ({ url: absoluteUrl(`/${k}`), changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
  try {
    const [products, areas, posts, blogCats, locations] = await Promise.all([
      prisma.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.therapeuticArea.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, select: { slug: true, updatedAt: true } }),
      prisma.blogCategory.findMany({ where: { posts: { some: { status: "PUBLISHED" } } }, select: { slug: true } }),
      prisma.location.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...staticPages,
      ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
      ...areas.map((a) => ({ url: absoluteUrl(`/therapeutic-areas/${a.slug}`), lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
      ...blogCats.map((c) => ({ url: absoluteUrl(`/blog/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.4 })),
      ...locations.map((l) => ({ url: absoluteUrl(`/pharma-franchise-${l.slug}`), lastModified: l.updatedAt, changeFrequency: "monthly" as const, priority: 0.75 })),
    ];
  } catch {
    return staticPages;
  }
}
