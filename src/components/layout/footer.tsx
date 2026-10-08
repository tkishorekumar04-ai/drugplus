import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { telLink } from "@/lib/utils";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/shared/social-icons";

type Area = { name: string; slug: string };

export function Footer({ s, areas, ranges }: { s: SiteSettings; areas: Area[]; ranges: Area[] }) {
  const socials = [
    { href: s.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: s.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: s.social.x, label: "X", Icon: XIcon },
  ].filter((x) => x.href);

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Quality & Manufacturing", href: "/quality" },
        { label: "Certifications", href: "/certifications" },
        { label: "Export", href: "/export" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Business",
      links: [
        { label: "PCD Pharma Franchise", href: "/pcd-pharma-franchise" },
        { label: "Pharma Franchise Company", href: "/pharma-franchise-company" },
        { label: "Third-Party Manufacturing", href: "/third-party-pharma-manufacturing" },
        { label: "Franchise by Location", href: "/pharma-franchise-locations" },
        { label: "Pharmaceutical Company in India", href: "/pharmaceutical-company-india" },
      ],
    },
    { title: "Products", links: [{ label: "All Products", href: "/products" }, ...ranges.slice(0, 6).map((r) => ({ label: r.name, href: `/products?category=${r.slug}` }))] },
    { title: "Therapeutic Areas", links: areas.slice(0, 7).map((a) => ({ label: a.name, href: `/therapeutic-areas/${a.slug}` })) },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(53,182,161,0.12),transparent_55%)]" aria-hidden />
      <div className="container relative pb-28 pt-16 lg:pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2.75fr]">
          <div>
            <Logo name={s.company.name} logoUrl={s.company.logoUrl} tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-200">{s.company.description}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden /><a href={telLink(s.contact.phone)} className="hover:text-white">{s.contact.phone}</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden /><a href={`mailto:${s.contact.email}`} className="hover:text-white">{s.contact.email}</a></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden /><span>{s.contact.address}</span></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" aria-hidden /><span>{s.contact.businessHours}</span></li>
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/15">
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white">{c.title}</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {c.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-navy-200 transition hover:text-white">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-navy-200">
          <strong className="font-semibold text-white">Disclaimer: </strong>
          {s.disclaimer}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-navy-300 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {s.company.legalName}. All rights reserved.</p>
            {(s.regulatory.drugLicence || s.regulatory.gstin || s.regulatory.cin) && (
              <p>
                {[s.regulatory.drugLicence && `Drug Licence: ${s.regulatory.drugLicence}`, s.regulatory.gstin && `GSTIN: ${s.regulatory.gstin}`, s.regulatory.cin && `CIN: ${s.regulatory.cin}`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            <li><Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link></li>
            <li><Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
