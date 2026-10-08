import Image from "next/image";
import { ArrowRight, Handshake, Scale, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { QualityPanelArt } from "./art";

const POINTS = [
  { icon: ShieldCheck, title: "Quality First", text: "Every formulation follows documented quality processes from sourcing to dispatch." },
  { icon: Scale, title: "Ethical Business", text: "Transparent terms, honest product information and compliant promotion." },
  { icon: Handshake, title: "Long-Term Partnerships", text: "We grow when our partners grow — support continues long after onboarding." },
];

export function AboutSplit({ companyName, imageUrl, body }: { companyName: string; imageUrl?: string; body?: string }) {
  return (
    <section className="section bg-white" aria-labelledby="about-title">
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          {imageUrl ? (
            <div className="relative aspect-[5/6] overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-[5/6]">
              <Image src={imageUrl} alt={`${companyName} facility`} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <QualityPanelArt className="aspect-[5/6] sm:aspect-[4/3] lg:aspect-[5/6]" />
          )}
          <div className="absolute -bottom-6 -right-2 hidden w-56 rounded-2xl border border-line bg-white p-5 shadow-lift sm:block lg:-right-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Our Promise</p>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-navy-950">Consistent quality, reliable supply and honest partnerships.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Eyebrow>About Our Company</Eyebrow>
          <h2 id="about-title" className="mt-3 text-display-md text-balance text-navy-950">Committed to Quality. Driven by Healthcare.</h2>
          <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-ink-muted">
            {body ? (
              body.split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>
                  {companyName} is an Indian pharmaceutical company focused on dependable, quality-assured formulations across major therapeutic segments — and on building
                  durable businesses with franchise partners, distributors and healthcare institutions.
                </p>
                <p>
                  Our portfolio spans tablets, capsules, syrups, injectables, topicals and nutraceuticals, manufactured at partner facilities that follow GMP practices. We back
                  every partner with promotional material, territory protection and a responsive supply chain — and we are steadily building relationships in international markets.
                </p>
              </>
            )}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {POINTS.map(({ icon: I, title, text }) => (
              <li key={title} className="rounded-2xl bg-surface p-4 ring-1 ring-inset ring-line">
                <I className="h-6 w-6 text-teal-600" strokeWidth={1.6} aria-hidden />
                <p className="mt-3 font-bold text-navy-950">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
          <LinkButton href="/about" variant="navy" size="lg" className="mt-8">
            Know More About Us <ArrowRight aria-hidden />
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
