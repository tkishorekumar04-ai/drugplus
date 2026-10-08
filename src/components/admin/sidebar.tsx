"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, FileBadge2, FolderTree, Globe2, Image as ImageIcon, Inbox, LayoutDashboard, MapPin, Menu, MessageSquareQuote, Newspaper, Package, Settings, Stethoscope, Tags, Users, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }, { href: "/admin/leads", label: "Leads", icon: Inbox }] },
  {
    group: "Catalogue",
    items: [
      { href: "/admin/r/products", label: "Products", icon: Package },
      { href: "/admin/r/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/r/therapeutic-areas", label: "Therapeutic Areas", icon: Stethoscope },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/r/blog", label: "Blog Posts", icon: Newspaper },
      { href: "/admin/r/blog-categories", label: "Blog Categories", icon: Tags },
      { href: "/admin/r/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/r/certificates", label: "Certificates", icon: FileBadge2 },
      { href: "/admin/r/stats", label: "Statistics", icon: BarChart3 },
      { href: "/admin/r/locations", label: "Location Pages", icon: MapPin },
      { href: "/admin/r/gallery", label: "Facility Gallery", icon: ImageIcon },
      { href: "/admin/r/export-markets", label: "Export Markets", icon: Globe2 },
    ],
  },
  { group: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }, { href: "/admin/r/users", label: "Users", icon: Users }] },
];

export function AdminSidebar({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed left-3 top-3 z-40 grid h-10 w-10 place-items-center rounded-xl bg-white shadow-card lg:hidden" aria-label="Open admin menu">
        <Menu className="h-5 w-5" />
      </button>
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-navy-950 p-4 text-navy-100 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-6 flex items-center justify-between px-2 pt-2">
          <Link href="/admin" className="text-lg font-extrabold text-white">Admin</Link>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden" aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav aria-label="Admin">
          {NAV.map((g) => (
            <div key={g.group} className="mb-5">
              <p className="mb-2 px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-navy-400">{g.group}</p>
              <ul className="space-y-0.5">
                {g.items.map(({ href, label, icon: I }) => (
                  <li key={href}>
                    <Link href={href} onClick={() => setOpen(false)} aria-current={active(href) ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition", active(href) ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white")}>
                      <I className="h-4 w-4" aria-hidden /> {label}
                      {href === "/admin/leads" && newLeads > 0 && <span className="ml-auto rounded-full bg-teal-500 px-2 py-0.5 text-[0.7rem] font-bold text-navy-950">{newLeads}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <Link href="/" target="_blank" className="mt-4 block px-3 text-sm text-navy-300 hover:text-white">View website ↗</Link>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}
    </>
  );
}
