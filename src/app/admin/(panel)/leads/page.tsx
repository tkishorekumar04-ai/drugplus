import Link from "next/link";
import { Download, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { leadWhere } from "@/lib/admin/lead-filters";
import { LEAD_STATUSES, LEAD_STATUS_LABEL, LEAD_TYPES, LEAD_TYPE_LABEL } from "@/lib/constants";
import { PageTitle, dt } from "@/components/admin/ui";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";

const PAGE = 25;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = leadWhere(sp);
  const [leads, total, sources] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { franchiseEnquiry: true } }),
    prisma.lead.count({ where }),
    prisma.lead.findMany({ distinct: ["source"], select: { source: true }, orderBy: { source: "asc" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams(Object.entries({ ...sp, ...extra }).filter(([, v]) => v !== undefined && v !== "") as [string, string][]);
    return p.toString();
  };
  const exportQs = qs({ page: "" });
  const field = "h-10 rounded-xl border border-line bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <>
      <PageTitle
        title="Leads"
        description={`${total} ${total === 1 ? "enquiry" : "enquiries"} match the current filters.`}
        actions={<a href={`/api/admin/leads/export?${exportQs}`} className="inline-flex h-10 items-center gap-2 rounded-full bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800"><Download className="h-4 w-4" aria-hidden /> Export CSV</a>}
      />
      <form className="mb-5 grid gap-2 rounded-2xl border border-line bg-white p-3 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)_auto_auto_auto]" role="search">
        <label className="relative">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
          <input name="q" defaultValue={sp.q} placeholder="Name, phone, email, city, campaign…" className={`${field} w-full pl-9`} />
        </label>
        <select name="status" defaultValue={sp.status ?? ""} className={field} aria-label="Status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>)}
        </select>
        <select name="type" defaultValue={sp.type ?? ""} className={field} aria-label="Type">
          <option value="">All types</option>
          {LEAD_TYPES.map((s) => <option key={s} value={s}>{LEAD_TYPE_LABEL[s]}</option>)}
        </select>
        <select name="source" defaultValue={sp.source ?? ""} className={field} aria-label="Form source">
          <option value="">All forms</option>
          {sources.map((s) => <option key={s.source} value={s.source}>{s.source}</option>)}
        </select>
        <input type="date" name="from" defaultValue={sp.from} className={field} aria-label="From date" />
        <input type="date" name="to" defaultValue={sp.to} className={field} aria-label="To date" />
        <div className="flex gap-2">
          <button className="h-10 rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white">Filter</button>
          <Link href="/admin/leads" className="grid h-10 place-items-center rounded-xl border border-line px-3 text-sm font-semibold">Reset</Link>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-ink-subtle">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Name / Contact</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Interest</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => (
              <tr key={l.id} className="align-top hover:bg-surface/60">
                <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{dt(l.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-semibold text-navy-950 hover:text-brand-600">{l.name}</Link>
                  <div className="text-ink-muted"><a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a>{l.email && <> · {l.email}</>}</div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{[l.city, l.state].filter(Boolean).join(", ") || "—"}{l.franchiseEnquiry?.preferredTerritory && <div className="text-xs">Territory: {l.franchiseEnquiry.preferredTerritory}</div>}</td>
                <td className="px-4 py-3"><span className="font-medium text-navy-900">{LEAD_TYPE_LABEL[l.type]}</span>{l.interestedCategory && <div className="text-xs text-ink-muted">{l.interestedCategory}</div>}</td>
                <td className="px-4 py-3 text-ink-muted">{l.source}{l.utmSource && <div className="text-xs">utm: {l.utmSource}/{l.utmMedium ?? "-"}{l.utmCampaign ? ` · ${l.utmCampaign}` : ""}</div>}</td>
                <td className="px-4 py-3"><LeadStatusSelect id={l.id} status={l.status} /></td>
              </tr>
            ))}
            {!leads.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-muted">No leads found.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-ink-muted">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link className="rounded-full border border-line bg-white px-4 py-2 font-semibold" href={`/admin/leads?${qs({ page: page - 1 })}`}>Previous</Link>}
            {page < pages && <Link className="rounded-full border border-line bg-white px-4 py-2 font-semibold" href={`/admin/leads?${qs({ page: page + 1 })}`}>Next</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
