import { BadgeCheck, Factory, Layers, MapPinned, Megaphone, Truck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";

const ITEMS = [
  { icon: BadgeCheck, title: "Quality-Assured Products", text: "Formulations produced under documented quality systems with batch-wise testing and traceability." },
  { icon: Factory, title: "WHO-GMP Manufacturing", text: "Products are manufactured at GMP-compliant facilities. Certificates are available for verification on request." },
  { icon: Layers, title: "Wide Product Portfolio", text: "Tablets, capsules, syrups, injectables, topicals and nutraceuticals across key specialities." },
  { icon: MapPinned, title: "Monopoly Rights", text: "Exclusive, territory-protected distribution rights so you can build your market with confidence." },
  { icon: Megaphone, title: "Marketing & Promotional Support", text: "Visual aids, product cards, MR bags, samples and digital assets to support doctor detailing." },
  { icon: Truck, title: "Reliable Supply & Distribution", text: "Planned inventory and dispatch processes designed to keep your stockists supplied on time." },
];

export function WhyChoose() {
  return (
    <section className="section bg-surface" aria-labelledby="why-title">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Why Choose Us" title={<span id="why-title">A partner built for long-term pharma businesses</span>} description="Everything a franchise partner or distributor needs to grow — quality products, protected territory and hands-on support." />
        </div>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: I, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.05}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lift">
                <span className="absolute right-6 top-6 text-sm font-bold tabular-nums text-navy-200 transition group-hover:text-teal-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100 transition group-hover:bg-teal-600 group-hover:text-white group-hover:ring-teal-600">
                  <I className="h-6 w-6" strokeWidth={1.6} aria-hidden />
                </span>
                <h3 className="mt-6 text-lg font-bold text-navy-950">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
