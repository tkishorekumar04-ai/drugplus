"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X, ArrowRight } from "lucide-react";
import { cn, telLink, whatsappLink } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/shared/social-icons";
import { TrackedLink } from "@/components/shared/tracked-link";
import { MAIN_NAV } from "./nav";

type Props = { logo: React.ReactNode; phone: string; whatsapp: string; whatsappMessage: string };

export function Header({ logo, phone, whatsapp, whatsappMessage }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Mobile menu: lock scroll, close on Escape, keep focus inside
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const f = els[0], l = els[els.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const wa = whatsappLink(whatsapp, whatsappMessage);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "border-line bg-white/90 shadow-[0_6px_24px_-12px_rgba(13,30,63,0.18)] backdrop-blur-xl" : "border-transparent bg-white",
      )}
    >
      <div className={cn("container flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-16" : "h-[4.75rem]")}>
        <Link href="/" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          {logo}
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {MAIN_NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[0.9rem] font-semibold transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    isActive(item.href) ? "text-brand-600" : "text-navy-800",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <TrackedLink
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            event="whatsapp_click"
            params={{ location: "header" }}
            aria-label="Chat on WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full text-[#1A9E52] transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </TrackedLink>
          <TrackedLink
            href={telLink(phone)}
            event="call_click"
            params={{ location: "header" }}
            aria-label={`Call ${phone}`}
            className="grid h-10 w-10 place-items-center rounded-full text-navy-800 transition hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Phone className="h-[1.15rem] w-[1.15rem]" aria-hidden />
          </TrackedLink>
          <LinkButton href="/pcd-pharma-franchise#apply" size="sm" className="ml-1 hidden sm:inline-flex">
            Get Franchise Enquiry
          </LinkButton>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-navy-900 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white xl:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <nav aria-label="Mobile" className="container py-4">
          <ul className="divide-y divide-line">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn("flex items-center justify-between py-3.5 text-lg font-semibold", isActive(item.href) ? "text-brand-600" : "text-navy-900")}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-ink-subtle" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <LinkButton href="/pcd-pharma-franchise#apply" size="lg">Get Franchise Enquiry</LinkButton>
            <div className="grid grid-cols-2 gap-3">
              <a href={telLink(phone)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line font-semibold text-navy-900">
                <Phone className="h-4 w-4" aria-hidden /> Call
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#147A3E] font-semibold text-white">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
