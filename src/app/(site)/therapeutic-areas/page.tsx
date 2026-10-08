import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getTherapeuticAreas } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { TherapeuticGrid } from "@/components/sections/therapeutic-grid";
import { FinalCta } from "@/components/sections/final-cta";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Therapeutic Areas — Pharma Franchise Product Ranges", description: "Explore our therapeutic segments: cardiology, diabetology, dermatology, gynecology, pediatrics, orthopedics, gastroenterology, respiratory, neurology and more.", path: "/therapeutic-areas" });
}

export default async function AreasPage() {
  const [s, areas] = await Promise.all([getSettings(), getTherapeuticAreas()]);
  return (
    <>
      <PageHero crumbs={[{ name: "Therapeutic Areas", path: "/therapeutic-areas" }]} eyebrow="Therapeutic Areas" title="Specialised ranges across key therapeutic segments" description="Choose focused portfolios for the doctors and specialities you serve — or combine ranges for a complete multi-speciality offering." />
      <section className="section bg-surface">
        <div className="container"><TherapeuticGrid areas={areas} /></div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
