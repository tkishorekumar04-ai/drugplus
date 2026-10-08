import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { enabledCrmProviders, crmProviders } from "@/lib/crm";
import { LEAD_STATUSES, LEAD_TYPE_LABEL } from "@/lib/constants";
import { getSettings } from "@/lib/settings";
import { PageTitle, Panel, StatCard, StatusPill, dt } from "@/components/admin/ui";

export default async function Dashboard() {
  const since = (days: number) => new Date(Date.now() - days * 86_400_000);
  const startToday = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30");
  const [today, week, month, total, byStatus, byType, bySource, recent, products, posts, unverifiedCerts, publishedStats, testimonials, s] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startToday } } }),
    prisma.lead.count({ where: { createdAt: { gte: since(7) } } }),
    prisma.lead.count({ where: { createdAt: { gte: since(30) } } }),
    prisma.lead.count(),
    prisma.lead.groupBy({ by: ["status"], _count: true }),
    prisma.lead.groupBy({ by: ["type"], _count: true, where: { createdAt: { gte: since(30) } } }),
    prisma.lead.groupBy({ by: ["utmSource"], _count: true, where: { createdAt: { gte: since(30) } }, orderBy: { _count: { utmSource: "desc" } }, take: 6 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.certificate.count({ where: { isVerified: false } }),
    prisma.stat.count({ where: { isPublished: true } }),
    prisma.testimonial.count({ where: { isPublished: true, consentConfirmed: true } }),
    getSettings(),
  ]);
  const enabled = enabledCrmProviders().map((p) => p.name);

  const checklist = [
    { ok: !s.contact.phone.includes("90000 00000"), label: "Set real phone & WhatsApp numbers", href: "/admin/settings" },
    { ok: !s.contact.address.startsWith("Update"), label: "Add registered office address", href: "/admin/settings" },
    { ok: publishedStats > 0, label: "Enter & publish verified statistics", href: "/admin/r/stats" },
    { ok: unverifiedCerts === 0, label: "Upload & verify certificates (or delete placeholders)", href: "/admin/r/certificates" },
    { ok: testimonials > 0, label: "Add genuine testimonials (with consent)", href: "/admin/r/testimonials" },
    { ok: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), label: "Enable Cloudflare Turnstile spam protection", href: "/admin/settings" },
    { ok: Boolean(process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GTM_ID), label: "Configure GA4 / GTM", href: "/admin/settings" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" description="Enquiries and website health at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Leads today" value={today} href="/admin/leads" />
        <StatCard label="Last 7 days" value={week} href="/admin/leads" />
        <StatCard label="Last 30 days" value={month} href="/admin/leads" />
        <StatCard label="All-time leads" value={total} href="/admin/leads" hint={`${products} products · ${posts} posts live`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Recent enquiries" className="xl:col-span-2" actions={<Link href="/admin/leads" className="text-sm font-semibold text-brand-600">View all</Link>}>
          {recent.length ? (
            <ul className="-my-2 divide-y divide-line">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-surface">
                    <span>
                      <span className="block font-semibold text-navy-950">{l.name} <span className="font-normal text-ink-muted">· {l.phone}</span></span>
                      <span className="text-sm text-ink-muted">{LEAD_TYPE_LABEL[l.type]} · {[l.city, l.state].filter(Boolean).join(", ") || "—"} · {l.source}</span>
                    </span>
                    <span className="flex items-center gap-3 text-sm text-ink-subtle">{dt(l.createdAt)} <StatusPill status={l.status} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">No enquiries yet.</p>
          )}
        </Panel>
        <div className="space-y-6">
          <Panel title="Pipeline">
            <ul className="space-y-2">
              {LEAD_STATUSES.map((st) => (
                <li key={st} className="flex items-center justify-between">
                  <Link href={`/admin/leads?status=${st}`}><StatusPill status={st} /></Link>
                  <span className="font-bold tabular-nums">{byStatus.find((b) => b.status === st)?._count ?? 0}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Last 30 days by type">
            <ul className="space-y-1.5 text-sm">
              {byType.length ? byType.map((b) => (
                <li key={b.type} className="flex justify-between"><span>{LEAD_TYPE_LABEL[b.type]}</span><span className="font-bold">{b._count}</span></li>
              )) : <li className="text-ink-muted">No data</li>}
            </ul>
            {bySource.length > 0 && (
              <>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-subtle">Top UTM sources</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {bySource.map((b) => <li key={b.utmSource ?? "direct"} className="flex justify-between"><span>{b.utmSource ?? "(direct / organic)"}</span><span className="font-bold">{b._count}</span></li>)}
                </ul>
              </>
            )}
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Launch checklist">
          <ul className="space-y-2.5">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5 text-sm">
                {c.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Done" /> : <AlertTriangle className="h-4 w-4 text-amber-600" aria-label="To do" />}
                <Link href={c.href} className={c.ok ? "text-ink-muted line-through" : "font-medium text-navy-900 hover:underline"}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="CRM & integrations">
          <ul className="space-y-2 text-sm">
            {crmProviders.map((p) => (
              <li key={p.name} className="flex items-center justify-between">
                <span className="capitalize">{p.name.replace("-", " ")}</span>
                {enabled.includes(p.name) ? <span className="font-semibold text-emerald-700">Connected</span> : <span className="text-ink-subtle">Not configured</span>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-subtle">Integrations are configured with environment variables (see README). Every lead is always stored in the database first.</p>
        </Panel>
      </div>
    </>
  );
}
