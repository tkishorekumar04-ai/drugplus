import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus, Search } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getResource, type Column } from "@/lib/admin/resources";
import { listResource } from "@/lib/admin/data";
import { PageTitle, StatusPill, dt } from "@/components/admin/ui";

function cellValue(row: Record<string, unknown>, c: Column) {
  const v = c.path ? c.path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | null)?.[k], row) : row[c.name];
  if (c.type === "boolean") return v ? <span className="font-semibold text-emerald-700">Yes</span> : <span className="text-ink-subtle">No</span>;
  if (c.type === "date") return dt(v as Date | null);
  if (c.type === "badge") return v ? <StatusPill status={String(v)} /> : "—";
  const s = v == null ? "—" : String(v);
  return s.length > 80 ? `${s.slice(0, 80)}…` : s;
}

export default async function ResourceList({ params, searchParams }: { params: Promise<{ resource: string }>; searchParams: Promise<{ q?: string; page?: string; saved?: string; deleted?: string }> }) {
  const [{ resource }, sp, session] = await Promise.all([params, searchParams, getSession()]);
  const res = getResource(resource);
  if (!res || (res.adminOnly && session?.role !== "ADMIN")) notFound();
  const page = Math.max(1, Number(sp.page) || 1);
  const { rows, total, pages } = await listResource(res, sp.q, page);

  return (
    <>
      <PageTitle
        title={res.label}
        description={`${total} ${total === 1 ? "item" : "items"}`}
        actions={<Link href={`/admin/r/${res.key}/new`} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" aria-hidden /> New {res.singular}</Link>}
      />
      {res.note && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{res.note}</p>}
      {(sp.saved || sp.deleted) && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{sp.saved ? "Saved successfully." : "Deleted."}</p>}
      <form className="mb-4 max-w-md" role="search">
        <label className="relative block">
          <span className="sr-only">Search {res.label}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden />
          <input name="q" defaultValue={sp.q} placeholder={`Search ${res.label.toLowerCase()}…`} className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </label>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wider text-ink-subtle">
            <tr>
              {res.columns.map((c) => <th key={c.name} className="px-4 py-3 font-semibold">{c.label}</th>)}
              <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => {
              const pub = res.publicPath?.(r);
              return (
                <tr key={String(r.id)} className="hover:bg-surface/60">
                  {res.columns.map((c, i) => (
                    <td key={c.name} className="px-4 py-3 text-ink-muted">
                      {i === 0 ? <Link href={`/admin/r/${res.key}/${r.id}`} className="font-semibold text-navy-950 hover:text-brand-600">{cellValue(r, c)}</Link> : cellValue(r, c)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {pub && <a href={pub} target="_blank" className="mr-3 inline-flex items-center gap-1 text-ink-subtle hover:text-navy-900" aria-label="View on website"><ExternalLink className="h-4 w-4" /></a>}
                    <Link href={`/admin/r/${res.key}/${r.id}`} className="font-semibold text-brand-600">Edit</Link>
                  </td>
                </tr>
              );
            })}
            {!rows.length && <tr><td colSpan={res.columns.length + 1} className="px-4 py-10 text-center text-ink-muted">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="mt-5 flex gap-2" aria-label="Pagination">
          {page > 1 && <Link className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold" href={`?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(page - 1) })}`}>Previous</Link>}
          {page < pages && <Link className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold" href={`?${new URLSearchParams({ ...(sp.q ? { q: sp.q } : {}), page: String(page + 1) })}`}>Next</Link>}
        </nav>
      )}
    </>
  );
}
