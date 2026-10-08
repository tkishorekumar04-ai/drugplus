import { BadgeIndianRupee, Boxes, Compass, Handshake, Megaphone, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";

const BENEFITS = [
  { icon: ShieldCheck, title: "Quality Products", text: "Consistent, documented quality you can stand behind with doctors and chemists." },
  { icon: BadgeIndianRupee, title: "Competitive Pricing", text: "Partner-friendly margins designed for sustainable growth in your market." },
  { icon: Compass, title: "Monopoly Rights", text: "Exclusive territory so your effort builds your brand — not someone else's." },
  { icon: Megaphone, title: "Marketing Support", text: "Visual aids, literature, gifts and digital creatives for effective promotion." },
  { icon: Boxes, title: "Product Portfolio", text: "A multi-speciality range to serve GPs, specialists and hospitals alike." },
  { icon: Truck, title: "Reliable Supply", text: "Planned stock and prompt dispatch to keep your stockists supplied." },
  { icon: PackageCheck, title: "Business Guidance", text: "Help with licensing, product selection and launch planning." },
  { icon: Handshake, title: "Long-Term Partnership", text: "Transparent terms and a relationship built to last for years." },
];

export function PartnerBenefits() {
  return (
    <section className="section bg-white" aria-labelledby="benefits-title">
      <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader eyebrow="Why Partner With Us" title={<span id="benefits-title">Everything you need to build a stronger pharma business</span>} description="We combine a dependable product range with the commercial support that franchise partners actually need on the ground." />
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-100">Partner support includes</p>
            <p className="mt-2 text-lg font-semibold leading-snug">Onboarding guidance · Product training · Promotional inputs · Order & dispatch support</p>
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {BENEFITS.map(({ icon: I, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 2) * 0.05} className="bg-white">
              <div className="flex h-full gap-4 p-6 transition hover:bg-surface sm:p-7">
                <I className="h-7 w-7 shrink-0 text-brand-600" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="font-bold text-navy-950">{title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
