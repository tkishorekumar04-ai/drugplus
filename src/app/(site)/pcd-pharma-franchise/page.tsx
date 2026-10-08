import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, Briefcase, FileText, Gift, Headphones, MapPinned, Megaphone, ShieldCheck, Truck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { getFranchiseSegments, getStats } from "@/lib/queries";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Faq } from "@/components/shared/faq";
import { LinkButton } from "@/components/ui/button";
import { FRANCHISE_STEPS } from "@/components/sections/franchise-band";
import { FranchiseApply } from "@/components/sections/franchise-apply";
import { Stats } from "@/components/sections/stats";
import { FinalCta } from "@/components/sections/final-cta";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "PCD Pharma Franchise — Monopoly Rights & Promotional Support",
    description: "Start your PCD pharma franchise business with monopoly rights, territory protection, a multi-speciality product portfolio, promotional support and reliable supply. Apply online.",
    path: "/pcd-pharma-franchise",
  });
}

const BENEFITS = [
  { icon: MapPinned, title: "Monopoly Rights", text: "Exclusive rights for your agreed products and territory — your effort builds your business." },
  { icon: ShieldCheck, title: "Territory Protection", text: "Clearly documented territory boundaries, respected by our sales team." },
  { icon: Boxes, title: "Product Portfolio", text: "Multi-speciality range across tablets, capsules, syrups, injectables, topicals and nutraceuticals." },
  { icon: Megaphone, title: "Promotional Support", text: "Visual aids, literature, reminder cards and samples for effective doctor detailing." },
  { icon: Briefcase, title: "Business Assistance", text: "Guidance on licensing, product selection, pricing and launch planning." },
  { icon: Gift, title: "Marketing Materials", text: "MR bags, diaries, pens, prescription pads and digital creatives as per scheme." },
  { icon: Truck, title: "Reliable Supply", text: "Planned inventory and prompt dispatch with proper documentation." },
  { icon: Headphones, title: "Franchise Support", text: "A dedicated contact for orders, schemes and product queries." },
];

const KIT = ["Visual aids & product literature", "Product cards & reminder cards", "Physician samples (as per policy)", "MR bags, diaries & stationery", "Digital creatives for WhatsApp & social", "Product training for your team"];

const FAQ = [
  { q: "What is a PCD pharma franchise?", a: "PCD (Propaganda Cum Distribution) is a model in which a pharmaceutical company authorises a partner to promote and distribute its products within a defined territory, usually with monopoly rights." },
  { q: "Do I get monopoly rights?", a: "Yes. Franchise partners receive monopoly rights for agreed products within an agreed territory, documented in a written agreement." },
  { q: "What documents are required?", a: "Typically a valid wholesale drug licence, GST registration, firm registration documents and identity/address proofs. Our team shares a checklist during onboarding." },
  { q: "What is the minimum investment?", a: "Investment depends on your territory and the product ranges you select. Share your preferred range in the application and our team will suggest a suitable starting order." },
  { q: "How soon can I start?", a: "Once documentation is complete and the agreement is signed, your first order can be dispatched as per stock availability." },
];

export default async function FranchisePage() {
  const [s, segments, stats, locations] = await Promise.all([
    getSettings(),
    getFranchiseSegments(),
    getStats(),
    prisma.location.findMany({ where: { isPublished: true }, orderBy: { name: "asc" }, select: { name: true, slug: true } }),
  ]);
  return (
    <>
      <PageHero
        crumbs={[{ name: "PCD Pharma Franchise", path: "/pcd-pharma-franchise" }]}
        eyebrow="PCD & Monopoly Franchise"
        title="Start Your PCD Pharma Franchise Business"
        description="Partner with us to build a respected pharmaceutical business in your territory — with monopoly rights, a quality multi-speciality portfolio and support at every step."
        aside={
          <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-200">Every partner receives</p>
            <ul className="mt-4 space-y-3">
              {["Monopoly rights in writing", "Complete product list & price structure", "Promotional starter kit", "Dedicated franchise manager"].map((t) => (
                <li key={t} className="flex items-center gap-3 font-medium"><BadgeCheck className="h-5 w-5 shrink-0 text-teal-300" aria-hidden /> {t}</li>
              ))}
            </ul>
          </div>
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="#apply" variant="secondary" size="lg">Apply for Pharma Franchise <ArrowRight aria-hidden /></LinkButton>
          <LinkButton href="/products" variant="ghostLight" size="lg">View Product List</LinkButton>
        </div>
      </PageHero>
      <Stats stats={stats} />

      <section className="section bg-white" aria-labelledby="benefits-h">
        <div className="container">
          <SectionHeader align="center" eyebrow="Franchise Benefits" title={<span id="benefits-h">Why partners choose our franchise</span>} description="A complete business package — not just products." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: I, title, text }, i) => (
              <Reveal as="li" key={title} delay={(i % 4) * 0.05}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><I className="h-5 w-5" strokeWidth={1.7} aria-hidden /></span>
                  <h3 className="mt-5 font-bold text-navy-950">{title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-navy-950 text-white" aria-labelledby="process-h">
        <div className="container">
          <SectionHeader tone="light" align="center" eyebrow="How It Works" title={<span id="process-h">Five simple steps to start</span>} />
          <ol className="relative mt-14 grid gap-6 md:grid-cols-5">
            <span className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent md:block" aria-hidden />
            {FRANCHISE_STEPS.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 0.07} className="relative text-center">
                <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-500 text-lg font-extrabold text-navy-950 ring-8 ring-navy-950">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 font-bold">{st.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{st.text}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <LinkButton href="#apply" variant="secondary" size="lg">Apply for Pharma Franchise <ArrowRight aria-hidden /></LinkButton>
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="kit-h">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Promotional Support" title={<span id="kit-h">Everything you need to promote with confidence</span>} description="Quality promotional inputs help your team build relationships with doctors and chemists. Inputs are provided as per the applicable scheme and order value." />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {KIT.map((k) => (
                <li key={k} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-[0.95rem] font-medium text-navy-900 ring-1 ring-inset ring-line">
                  <FileText className="h-4 w-4 shrink-0 text-teal-600" aria-hidden /> {k}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-navy-900 p-8 text-white md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-teal-100">Who is this for?</p>
            <ul className="mt-5 space-y-4 text-lg">
              {["Experienced medical representatives ready to start their own business", "Pharma distributors & stockists adding a branded range", "Entrepreneurs entering the pharmaceutical business", "Existing PCD companies seeking additional ranges"].map((t) => (
                <li key={t} className="flex gap-3"><BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-teal-200" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <FranchiseApply segments={segments} phone={s.contact.phone} whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />

      <section className="section bg-white" aria-labelledby="faq-h">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="FAQ" title={<span id="faq-h">Franchise questions, answered</span>} />
            {locations.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-ink-subtle">Franchise by location</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {locations.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/pharma-franchise-${l.slug}`} className="inline-flex rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-navy-900 hover:border-teal-300 hover:bg-teal-50">{l.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Faq items={FAQ} />
        </div>
      </section>
      <FinalCta whatsapp={s.contact.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
