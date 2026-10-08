import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { PageHero } from "@/components/shared/page-hero";
import { Markdown } from "@/components/shared/markdown";

export const revalidate = 3600;
export function generateStaticParams() {
  return Object.keys(LEGAL).map((legal) => ({ legal }));
}

type Params = Promise<{ legal: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const doc = LEGAL[(await params).legal];
  if (!doc) return {};
  return buildMetadata({ title: doc.title, description: doc.description, path: `/${(await params).legal}` });
}

export default async function LegalPage({ params }: { params: Params }) {
  const { legal } = await params;
  const doc = LEGAL[legal];
  if (!doc) notFound();
  const s = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ name: doc.title, path: `/${legal}` }]} title={doc.title} description={doc.description} />
      <section className="bg-white py-14 md:py-20">
        <div className="container max-w-3xl">
          <Markdown content={doc.body(s)} />
        </div>
      </section>
    </>
  );
}
