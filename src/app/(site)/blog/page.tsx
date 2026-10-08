import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { BlogList } from "./blog-list";

export const revalidate = 300;

type SP = Promise<{ page?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const page = Number((await searchParams).page) || 1;
  return buildMetadata({ title: page > 1 ? `Blog — Page ${page}` : "Blog — Pharma Franchise & Industry Insights", description: "Guides on PCD pharma franchise, pharmaceutical business, licensing, therapeutic areas and healthcare.", path: page > 1 ? `/blog?page=${page}` : "/blog" });
}

export default async function BlogPage({ searchParams }: { searchParams: SP }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return (
    <>
      <PageHero crumbs={[{ name: "Blog", path: "/blog" }]} eyebrow="Insights" title="Pharma Franchise & Industry Insights" description="Practical guides for pharma entrepreneurs, distributors and healthcare businesses." />
      <section className="section bg-surface"><div className="container"><BlogList page={page} /></div></section>
    </>
  );
}
