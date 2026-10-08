import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { BlogList } from "../../blog-list";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await prisma.blogCategory.findUnique({ where: { slug: (await params).slug } });
  if (!c) return {};
  return buildMetadata({ title: `${c.name} Articles`, description: `Articles and guides about ${c.name.toLowerCase()}.`, path: `/blog/category/${c.slug}` });
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const c = await prisma.blogCategory.findUnique({ where: { slug: (await params).slug } });
  if (!c) notFound();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", path: "/blog" }, { name: c.name, path: `/blog/category/${c.slug}` }]} eyebrow="Blog Category" title={c.name} />
      <section className="section bg-surface"><div className="container"><BlogList categorySlug={c.slug} page={page} /></div></section>
    </>
  );
}
