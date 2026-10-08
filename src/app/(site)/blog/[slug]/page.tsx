import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { articleSchema } from "@/lib/jsonld";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/shared/json-ld";
import { Markdown } from "@/components/shared/markdown";
import { Faq } from "@/components/shared/faq";
import { QuickLeadForm } from "@/components/forms/quick-lead-form";
import { BlogCard } from "@/components/sections/blog-card";

export const revalidate = 600;
export async function generateStaticParams() {
  try {
    return (await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } })).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

type Params = Promise<{ slug: string }>;
const getPost = (slug: string) => prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED", publishedAt: { lte: new Date() } }, include: { category: true } });

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle || p.title, description: p.seoDescription || p.excerpt, path: `/blog/${p.slug}`, image: p.coverImageUrl, type: "article", publishedTime: p.publishedAt?.toISOString() });
}

export default async function PostPage({ params }: { params: Params }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const [s, more] = await Promise.all([
    getSettings(),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED", id: { not: p.id }, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true, category: { select: { name: true, slug: true } } },
    }),
  ]);
  const faq = (Array.isArray(p.faq) ? p.faq : []) as { q: string; a: string }[];
  const minutes = Math.max(2, Math.round(p.content.split(/\s+/).length / 220));

  return (
    <>
      <JsonLd data={articleSchema({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, image: p.coverImageUrl, publishedAt: p.publishedAt, updatedAt: p.updatedAt, author: p.author }, s)} />
      <article>
        <header className="border-b border-line bg-surface">
          <div className="container max-w-4xl py-10 md:py-14">
            <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, ...(p.category ? [{ name: p.category.name, path: `/blog/category/${p.category.slug}` }] : []), { name: p.title, path: `/blog/${p.slug}` }]} />
            {p.category && <Link href={`/blog/category/${p.category.slug}`} className="mt-8 inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 ring-1 ring-inset ring-teal-100">{p.category.name}</Link>}
            <h1 className="mt-4 text-display-lg text-balance text-navy-950">{p.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{p.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-ink-subtle">
              {p.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden /><time dateTime={p.publishedAt.toISOString()}>{formatDate(p.publishedAt, { dateStyle: "long" })}</time></span>}
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {minutes} min read</span>
              <span>By {p.author || `${s.company.name} Team`}</span>
            </div>
          </div>
        </header>
        <div className="container grid max-w-6xl gap-12 py-12 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0">
            {p.coverImageUrl && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl">
                <Image src={p.coverImageUrl} alt="" fill priority sizes="(min-width:1024px) 720px, 100vw" className="object-cover" />
              </div>
            )}
            <Markdown content={p.content} className="prose-lg" />
            {faq.length > 0 && (
              <section className="mt-12" aria-labelledby="post-faq">
                <h2 id="post-faq" className="mb-5 text-2xl font-bold text-navy-950">Frequently asked questions</h2>
                <Faq items={faq} />
              </section>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-lift">
              <QuickLeadForm source={`blog-${p.slug}`} title="Interested in a franchise?" subtitle="Get product list and terms for your territory." />
            </div>
          </aside>
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-surface py-16" aria-labelledby="more-h">
          <div className="container">
            <h2 id="more-h" className="text-2xl font-bold text-navy-950">More articles</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">{more.map((m, i) => <li key={m.id}><BlogCard post={m} index={i} /></li>)}</ul>
          </div>
        </section>
      )}
    </>
  );
}
