import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/social-icons";
import { TrackedLink } from "@/components/shared/tracked-link";
import { MoleculeArt } from "./art";

export function FinalCta({
  whatsapp,
  message,
  title = "Ready to Build a Stronger Pharma Business?",
  text = "Talk to our team about franchise opportunities, product partnerships and pharmaceutical business solutions.",
}: {
  whatsapp: string;
  message: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-white py-16 md:py-20" aria-labelledby="final-cta-title">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 px-6 py-14 text-center text-white sm:px-12 md:py-20">
          <div className="grid-pattern absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
          <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-teal-500/30 blur-[90px]" aria-hidden />
          <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-brand-500/30 blur-[90px]" aria-hidden />
          <MoleculeArt className="absolute -left-16 top-1/2 -z-10 h-[140%] -translate-y-1/2 text-white/[0.05]" />
          <h2 id="final-cta-title" className="mx-auto max-w-3xl text-display-lg text-balance">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-100/85">{text}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/pcd-pharma-franchise#apply" variant="secondary" size="lg">Get Franchise Details <ArrowRight aria-hidden /></LinkButton>
            <TrackedLink
              href={whatsappLink(whatsapp, message)}
              target="_blank"
              rel="noopener noreferrer"
              event="whatsapp_click"
              params={{ location: "final-cta" }}
              className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full bg-white px-7 font-semibold text-navy-900 transition hover:bg-navy-50"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#1A9E52]" /> Talk on WhatsApp
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
