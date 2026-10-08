import { Phone, Send } from "lucide-react";
import Link from "next/link";
import { telLink, whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/social-icons";
import { TrackedLink } from "@/components/shared/tracked-link";

/** Desktop: floating WhatsApp + Call buttons. Mobile: sticky 3-action bottom bar. */
export function FloatingActions({ phone, whatsapp, message }: { phone: string; whatsapp: string; message: string }) {
  const wa = whatsappLink(whatsapp, message);
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 lg:flex">
        <TrackedLink
          href={telLink(phone)}
          event="call_click"
          params={{ location: "floating" }}
          aria-label={`Call us at ${phone}`}
          className="grid h-12 w-12 place-items-center rounded-full bg-navy-900 text-white shadow-lift transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
        >
          <Phone className="h-5 w-5" aria-hidden />
        </TrackedLink>
        <TrackedLink
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          event="whatsapp_click"
          params={{ location: "floating" }}
          aria-label="Chat with us on WhatsApp"
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#1A9E52] text-white shadow-lift transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#1A9E52] opacity-20 motion-reduce:hidden" aria-hidden />
          <WhatsAppIcon className="relative h-7 w-7" />
        </TrackedLink>
      </div>

      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(13,30,63,0.2)] backdrop-blur lg:hidden"
      >
        <ul className="grid grid-cols-3 text-[0.72rem] font-bold uppercase tracking-wide">
          <li>
            <TrackedLink href={telLink(phone)} event="call_click" params={{ location: "mobile-bar" }} className="flex h-14 flex-col items-center justify-center gap-1 text-navy-900">
              <Phone className="h-[1.15rem] w-[1.15rem]" aria-hidden /> Call Now
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={wa} target="_blank" rel="noopener noreferrer" event="whatsapp_click" params={{ location: "mobile-bar" }} className="flex h-14 flex-col items-center justify-center gap-1 text-[#158544]">
              <WhatsAppIcon className="h-[1.15rem] w-[1.15rem]" /> WhatsApp
            </TrackedLink>
          </li>
          <li>
            <Link href="/pcd-pharma-franchise#apply" className="flex h-14 flex-col items-center justify-center gap-1 bg-brand-600 text-white">
              <Send className="h-[1.15rem] w-[1.15rem]" aria-hidden /> Enquire Now
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
