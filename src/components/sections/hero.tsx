import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { LinkButton } from "@/components/ui/button";
import { QuickLeadForm } from "@/components/forms/quick-lead-form";
import { Eyebrow } from "@/components/shared/section-header";
import { MoleculeArt } from "./art";

export function Hero({ s }: { s: SiteSettings }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white" aria-labelledby="hero-title">
      {s.hero.imageUrl ? (
        <>
          <Image src={s.hero.imageUrl} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/40" aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-pattern absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
          <div className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-brand-600/25 blur-[120px]" />
          <div className="absolute -bottom-48 left-1/4 h-[520px] w-[520px] rounded-full bg-teal-500/20 blur-[120px]" />
          <MoleculeArt className="absolute right-[-6%] top-1/2 hidden h-[115%] -translate-y-1/2 text-white/[0.07] lg:block" />
        </div>
      )}

      <div className="container grid items-center gap-12 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-24 lg:pt-24">
        <div className="animate-fade-up">
          <Eyebrow tone="light">{s.hero.eyebrow}</Eyebrow>
          <h1 id="hero-title" className="mt-5 max-w-[17ch] text-display-xl text-balance">
            {s.hero.headline}
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-navy-100/85 text-pretty">{s.hero.subheadline}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/pcd-pharma-franchise#apply" size="lg" variant="secondary">
              Get Franchise Enquiry <ArrowRight aria-hidden />
            </LinkButton>
            <LinkButton href="/products" size="lg" variant="ghostLight">
              Explore Products
            </LinkButton>
          </div>
          {s.hero.badges.length > 0 && (
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4" aria-label="Highlights">
              {s.hero.badges.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm font-semibold text-navy-50">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-teal-300" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div id="enquiry" className="relative animate-fade-up [animation-delay:150ms]">
          <div className="absolute -inset-px -z-10 rounded-[1.6rem] bg-gradient-to-br from-teal-300/40 via-white/10 to-brand-500/30 blur-[1px]" aria-hidden />
          <div className="rounded-3xl bg-white p-6 text-ink shadow-glow sm:p-7">
            <QuickLeadForm source="hero-form" />
          </div>
        </div>
      </div>
    </section>
  );
}
