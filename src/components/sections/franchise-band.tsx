import { ArrowRight, Check } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { MoleculeArt } from "./art";

export const FRANCHISE_STEPS = [
  { title: "Submit Enquiry", text: "Share your details and preferred territory using our quick form or WhatsApp." },
  { title: "Choose Your Territory", text: "We confirm availability and discuss monopoly rights for your district or region." },
  { title: "Select Product Portfolio", text: "Pick the speciality ranges that match the doctors and market you serve." },
  { title: "Complete Documentation", text: "Drug licence, GST and agreement formalities — our team guides every step." },
  { title: "Start Your Business", text: "Receive stock, promotional material and ongoing support to launch with confidence." },
];

const HIGHLIGHTS = ["Monopoly rights & territory protection", "Promotional & marketing materials", "Reliable supply and dispatch", "Dedicated business support"];

export function FranchiseBand() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 text-white md:py-28" aria-labelledby="franchise-band-title">
      <div className="grid-pattern absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="absolute -left-40 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[110px]" aria-hidden />
      <MoleculeArt className="absolute -right-24 -top-10 -z-10 h-[520px] text-white/[0.05]" />
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="light">PCD Pharma Franchise</Eyebrow>
            <h2 id="franchise-band-title" className="mt-3 text-display-lg text-balance">Start your own pharma franchise business</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100/80">
              Join as a PCD or monopoly franchise partner and build a respected pharmaceutical business in your territory — with a quality portfolio and a team that supports you
              at every stage.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[0.95rem] font-medium text-navy-50">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-500/20 text-teal-300"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/pcd-pharma-franchise#apply" variant="secondary" size="lg">Apply for Pharma Franchise <ArrowRight aria-hidden /></LinkButton>
              <LinkButton href="/pcd-pharma-franchise" variant="ghostLight" size="lg">How It Works</LinkButton>
            </div>
          </Reveal>
          <ol className="relative space-y-3" aria-label="Franchise process">
            {FRANCHISE_STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06}>
                <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.07]">
                  <span className="text-2xl font-extrabold tabular-nums text-teal-300">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-200">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
