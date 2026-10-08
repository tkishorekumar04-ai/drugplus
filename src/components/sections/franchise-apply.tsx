import { CheckCircle2, Clock, Phone } from "lucide-react";
import { FranchiseForm } from "@/components/forms/franchise-form";
import { telLink, whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/social-icons";
import { TrackedLink } from "@/components/shared/tracked-link";
import { Eyebrow } from "@/components/shared/section-header";

/** The primary conversion block: franchise application form + reassurance panel. */
export function FranchiseApply({
  segments,
  phone,
  whatsapp,
  message,
  source = "franchise-page",
  defaultState,
  defaultTerritory,
  title = "Apply for Pharma Franchise",
}: {
  segments: string[];
  phone: string;
  whatsapp: string;
  message: string;
  source?: string;
  defaultState?: string;
  defaultTerritory?: string;
  title?: string;
}) {
  return (
    <section id="apply" className="section bg-surface" aria-labelledby="apply-title">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <Eyebrow>Franchise Application</Eyebrow>
          <h2 id="apply-title" className="mt-3 text-display-md text-navy-950">{title}</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-muted">
            Tell us about your territory and experience. Our business development team reviews every application personally.
          </p>
          <ol className="mt-8 space-y-5">
            {[
              { t: "We review your application", d: "Territory availability and portfolio fit are checked." },
              { t: "A franchise manager calls you", d: "Usually within one business day." },
              { t: "You receive the product list & terms", d: "Including monopoly details for your area." },
            ].map((x, i) => (
              <li key={x.t} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-600 text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-bold text-navy-950">{x.t}</p>
                  <p className="text-sm text-ink-muted">{x.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10 rounded-2xl border border-line bg-white p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-950"><Clock className="h-4 w-4 text-teal-600" aria-hidden /> Prefer to talk now?</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <TrackedLink href={telLink(phone)} event="call_click" params={{ location: source }} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy-900 font-semibold text-white hover:bg-navy-800">
                <Phone className="h-4 w-4" aria-hidden /> {phone}
              </TrackedLink>
              <TrackedLink href={whatsappLink(whatsapp, message)} target="_blank" rel="noopener noreferrer" event="whatsapp_click" params={{ location: source }} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#147A3E] font-semibold text-white hover:bg-[#10632F]">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </TrackedLink>
            </div>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            {["No obligation — enquiry is free", "Your details are never shared with third parties"].map((t) => (
              <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" aria-hidden />{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
          <FranchiseForm segments={segments} source={source} defaultState={defaultState} defaultTerritory={defaultTerritory} />
        </div>
      </div>
    </section>
  );
}
