import { ArrowRight, Boxes, ClipboardCheck, Factory, FlaskConical, Microscope, Package, Truck } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/button";

export const QUALITY_PILLARS = [
  { icon: ClipboardCheck, title: "Quality Control", text: "Raw material, in-process and finished-product checks against defined specifications." },
  { icon: FlaskConical, title: "Research & Development", text: "Formulation work focused on stability, patient compliance and consistent performance." },
  { icon: Factory, title: "Manufacturing Standards", text: "Production at facilities that follow GMP practices with documented SOPs." },
  { icon: Microscope, title: "Testing", text: "Analytical testing with batch records and certificates of analysis maintained." },
  { icon: Package, title: "Packaging", text: "Tamper-evident, compliant packaging with clear labelling and batch traceability." },
  { icon: Boxes, title: "Storage", text: "Controlled storage conditions appropriate to each product's requirements." },
  { icon: Truck, title: "Supply Chain", text: "Planned dispatch with proper documentation to partners across India." },
];

export function QualitySection({ certificates }: { certificates: { id: string; title: string; issuer: string | null }[] }) {
  return (
    <section className="section relative overflow-hidden bg-surface" aria-labelledby="quality-title">
      <div className="grid-pattern-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="container relative">
        <SectionHeader align="center" eyebrow="Quality & Manufacturing" title={<span id="quality-title">Quality You Can Trust</span>} description="Quality is built into every stage — from sourcing and formulation to testing, packaging and delivery." />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUALITY_PILLARS.map(({ icon: I, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.04} className={i === 0 ? "lg:row-span-2" : ""}>
              <div className={`relative h-full rounded-2xl border border-line bg-white p-6 shadow-card ${i === 0 ? "lg:flex lg:flex-col lg:justify-between lg:bg-navy-900 lg:text-white" : ""}`}>
                <div>
                  <span className={`text-xs font-bold tabular-nums ${i === 0 ? "text-teal-600 lg:text-teal-300" : "text-teal-600"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <I className={`mt-4 h-8 w-8 ${i === 0 ? "text-brand-600 lg:text-teal-300" : "text-brand-600"}`} strokeWidth={1.5} aria-hidden />
                  <h3 className={`mt-4 text-lg font-bold ${i === 0 ? "text-navy-950 lg:text-white" : "text-navy-950"}`}>{title}</h3>
                  <p className={`mt-2 text-[0.95rem] leading-relaxed ${i === 0 ? "text-ink-muted lg:text-navy-200" : "text-ink-muted"}`}>{text}</p>
                </div>
                {i === 0 && (
                  <LinkButton href="/quality" variant="white" size="sm" className="mt-6 hidden self-start lg:inline-flex">
                    Our quality approach <ArrowRight aria-hidden />
                  </LinkButton>
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        {certificates.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-6 sm:flex-row sm:justify-between">
            <p className="font-bold text-navy-950">Certifications & approvals</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {certificates.map((c) => (
                <li key={c.id} className="rounded-full bg-teal-50 px-3.5 py-1.5 text-sm font-semibold text-teal-800 ring-1 ring-inset ring-teal-100">{c.title}</li>
              ))}
            </ul>
            <LinkButton href="/certifications" variant="outline" size="sm">View documents</LinkButton>
          </div>
        )}
      </div>
    </section>
  );
}
