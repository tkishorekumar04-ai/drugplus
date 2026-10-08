import Link from "next/link";
import { prisma } from "@/lib/db";
import { BlogCard } from "@/components/sections/blog-card";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export async function BlogList({ categorySlug, page }: { categorySlug?: string; page: number }) {
  const where = { status: "PUBLISHED" as const, publishedAt: { lte: new Date() }, ...(categorySlug ? { category: { slug: categorySlug } } : {}) };
  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true, category: { select: { name: true, slug: true } } },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" }, where: { posts: { some: { status: "PUBLISHED" } } } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const base = categorySlug ? `/blog/category/${categorySlug}` : "/blog";
  return (
    <>
      <nav aria-label="Blog categories" className="-mt-2 mb-10 flex gap-2 overflow-x-auto pb-2">
        <Link href="/blog" className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset", !categorySlug ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-navy-800 ring-line hover:bg-navy-50")}>All</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/blog/category/${c.slug}`} aria-current={c.slug === categorySlug ? "page" : undefined} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset", c.slug === categorySlug ? "bg-navy-900 text-white ring-navy-900" : "bg-white text-navy-800 ring-line hover:bg-navy-50")}>
            {c.name}
          </Link>
        ))}
      </nav>
      {posts.length ? (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => <li key={p.id}><BlogCard post={p} index={i} /></li>)}
        </ul>
      ) : (
        <p className="text-ink-muted">No articles yet — check back soon.</p>
      )}
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={n === 1 ? base : `${base}?page=${n}`} aria-current={n === page ? "page" : undefined} className={cn("grid h-10 w-10 place-items-center rounded-full text-sm font-semibold", n === page ? "bg-navy-900 text-white" : "bg-white text-navy-800 ring-1 ring-inset ring-line")}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
