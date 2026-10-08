import Link from "next/link";
import { ArrowRight, Check, Factory, Globe2, Store } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";

const CARDS = [
  {
    icon: Store,
    title: "PCD Pharma Franchise",
    text: "Build your own pharma marketing business with monopoly rights in your territory.",
    benefits: ["Exclusive territory rights", "Multi-speciality portfolio", "Promotional support"],
    href: "/pcd-pharma-franchise",
    cta: "Explore Franchise",
    featured: true,
  },
  {
    icon: Factory,
    title: "Third-Party Manufacturing",
    text: "Launch your own brand with contract manufacturing of quality formulations.",
    benefits: ["Wide dosage-form capability", "Regulatory documentation", "Custom packaging"],
    href: "/third-party-pharma-manufacturing",
    cta: "Discuss Manufacturing",
  },
  {
    icon: Globe2,
    title: "Export Partnership",
    text: "Source Indian pharmaceutical formulations for registration and distribution abroad.",
    benefits: ["Dossier & documentation support", "Export-ready packaging", "Long-term supply"],
    href: "/export",
    cta: "Become a Partner",
  },
];

export function Partnerships() {
  return (
    <section className="section bg-surface" aria-labelledby="partner-title">
      <div className="container">
        <SectionHeader align="center" eyebrow="Business Opportunities" title={<span id="partner-title">Choose how you want to grow with us</span>} />
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {CARDS.map(({ icon: I, ...c }, i) => (
            <Reveal as="li" key={c.title} delay={i * 0.06}>
              <div className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition duration-300 hover:-translate-y-1 ${c.featured ? "bg-navy-900 text-white shadow-lift" : "border border-line bg-white shadow-card hover:shadow-lift"}`}>
                {c.featured && <span className="absolute right-6 top-6 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-200 ring-1 ring-inset ring-teal-400/30">Most popular</span>}
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${c.featured ? "bg-white/10 text-teal-300" : "bg-brand-50 text-brand-600"}`}>
                  <I className="h-7 w-7" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
                <p className={`mt-2 leading-relaxed ${c.featured ? "text-navy-200" : "text-ink-muted"}`}>{c.text}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-[0.95rem] font-medium">
                      <Check className={`h-4 w-4 ${c.featured ? "text-teal-300" : "text-teal-600"}`} aria-hidden /> {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={c.href}
                  className={`mt-8 inline-flex h-11 items-center justify-center gap-2 self-start rounded-full px-5 text-sm font-semibold transition ${c.featured ? "bg-teal-500 text-navy-950 hover:bg-teal-400" : "bg-navy-900 text-white hover:bg-navy-800"}`}
                >
                  {c.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
