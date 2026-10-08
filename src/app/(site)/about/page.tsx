import type { Metadata } from "next";
import { Compass, Eye, HeartHandshake, Lightbulb, ShieldCheck, Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { getStats } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { AboutSplit } from "@/components/sections/about-split";
import { Stats } from "@/components/sections/stats";
import { Partnerships } from "@/components/sections/partnerships";
import { FinalCta } from "@/components/sections/final-cta";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return buildMetadata({ title: `About ${s.company.name}`, description: `Learn about ${s.company.name} — our approach to quality, ethical business and long-term partnerships in the Indian pharmaceutical industry.`, path: "/about" });
}

const VALUES = [
  { icon: ShieldCheck, t: "Quality", d: "We hold every product to documented standards — no shortcuts." },
  { icon: HeartHandshake, t: "Integrity", d: "Honest information, transparent terms and compliant promotion." },
  { icon: Users, t: "Partnership", d: "Our partners' growth is the measure of our own." },
  { icon: Lightbulb, t: "Continuous Improvement", d: "We keep refining our portfolio, processes and service." },
];

export default async function AboutPage() {
  const [s, stats] = await Promise.all([getSettings(), getStats()]);
  return (
    <>
      <PageHero crumbs={[{ name: "About", path: "/about" }]} eyebrow="About Us" title={`About ${s.company.name}`} description={s.company.description} />
      <Stats stats={stats} />
      <AboutSplit companyName={s.company.name} imageUrl={s.about.imageUrl} body={s.about.body} />
      <section className="section bg-surface">
        <div className="container grid gap-6 md:grid-cols-2">
          {[
            { icon: Compass, t: "Our Mission", d: "To make dependable, quality-assured medicines accessible across India and beyond — while creating sustainable business opportunities for our partners." },
            { icon: Eye, t: "Our Vision", d: "To be a trusted name for healthcare professionals, partners and patients, known for consistent quality and ethical conduct." },
          ].map(({ icon: I, t, d }) => (
            <Reveal key={t}>
              <div className="h-full rounded-3xl border border-line bg-white p-8 shadow-card md:p-10">
                <I className="h-8 w-8 text-teal-600" strokeWidth={1.5} aria-hidden />
                <h2 className="mt-5 text-2xl font-bold text-navy-950">{t}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section bg-white">
        <div className="container">
          <SectionHeader align="center" eyebrow="Our Values" title="What guides our work" />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: I, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.05}>
                <div className="h-full rounded-2xl bg-surface p-6 ring-1 ring-inset ring-line">
                  <I className="h-7 w-7 text-brand-600" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-4 font-bold text-navy-950">{t}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <Partnerships />
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
