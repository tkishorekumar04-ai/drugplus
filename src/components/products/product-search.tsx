"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProductCardData } from "@/lib/products";
import { ProductCard } from "./product-card";

type Opt = { name: string; slug: string };
type Filters = { q: string; category: string; form: string; area: string; type: string; page: number };
type Result = { items: ProductCardData[]; total: number; page: number; pages: number };

export function ProductSearch({
  initial,
  initialFilters,
  options,
}: {
  initial: Result;
  initialFilters: Filters;
  options: { ranges: Opt[]; forms: Opt[]; areas: Opt[]; types: string[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [result, setResult] = useState<Result>(initial);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [, startTransition] = useTransition();
  const first = useRef(true);
  const abort = useRef<AbortController | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.q.trim()) p.set("q", filters.q.trim());
    if (filters.category) p.set("category", filters.category);
    if (filters.form) p.set("form", filters.form);
    if (filters.area) p.set("area", filters.area);
    if (filters.type) p.set("type", filters.type);
    if (filters.page > 1) p.set("page", String(filters.page));
    return p.toString();
  }, [filters]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ac = new AbortController();
      abort.current = ac;
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${qs}`, { signal: ac.signal });
        const data = (await res.json()) as Result;
        setResult(data);
        startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
        if (filters.q.trim()) track("product_search", { search_term: filters.q.trim(), results: data.total });
      } catch (e) {
        if ((e as Error).name !== "AbortError") console.error(e);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }, filters.q ? 280 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  const set = (k: keyof Filters, v: string | number) => setFilters((f) => ({ ...f, [k]: v, page: k === "page" ? (v as number) : 1 }));
  const activeCount = [filters.category, filters.form, filters.area, filters.type].filter(Boolean).length;
  const clear = () => setFilters({ q: "", category: "", form: "", area: "", type: "", page: 1 });

  const selects = (
    <>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-subtle">Category</span>
        <Select value={filters.category} onChange={(e) => set("category", e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {options.ranges.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
        </Select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-subtle">Therapeutic Area</span>
        <Select value={filters.area} onChange={(e) => set("area", e.target.value)} aria-label="Filter by therapeutic area">
          <option value="">All areas</option>
          {options.areas.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
        </Select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-subtle">Dosage Form</span>
        <Select value={filters.form} onChange={(e) => set("form", e.target.value)} aria-label="Filter by dosage form">
          <option value="">All forms</option>
          {options.forms.map((o) => <option key={o.slug} value={o.slug}>{o.name}</option>)}
        </Select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-subtle">Product Type</span>
        <Select value={filters.type} onChange={(e) => set("type", e.target.value)} aria-label="Filter by product type">
          <option value="">All types</option>
          {options.types.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
      </label>
    </>
  );

  return (
    <div>
      <div className="relative z-10 -mt-8 rounded-3xl border border-line bg-white p-4 shadow-lift sm:p-5">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <label htmlFor="product-q" className="sr-only">Search products</label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle" aria-hidden />
            <input
              id="product-q"
              type="search"
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search medicine, composition or product..."
              autoComplete="off"
              className="h-14 w-full rounded-2xl border border-line bg-surface pl-12 pr-12 text-base text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
            {loading && <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-600" aria-label="Loading" />}
          </div>
          <Button type="button" variant="outline" className="h-14 rounded-2xl px-4 lg:hidden" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters} aria-controls="product-filters">
            <SlidersHorizontal aria-hidden />
            <span className="sr-only sm:not-sr-only">Filters</span>
            {activeCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[0.7rem] text-white">{activeCount}</span>}
          </Button>
        </form>
        <div id="product-filters" className={`${showFilters ? "grid" : "hidden"} mt-4 gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
          {selects}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted" aria-live="polite">
          <strong className="text-navy-950">{result.total}</strong> {result.total === 1 ? "product" : "products"} found
          {filters.q.trim() && <> for “<span className="font-semibold text-navy-950">{filters.q.trim()}</span>”</>}
        </p>
        {(activeCount > 0 || filters.q) && (
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
            <X className="h-4 w-4" aria-hidden /> Clear all
          </button>
        )}
      </div>

      <div className={`mt-6 transition-opacity ${loading ? "opacity-60" : ""}`}>
        {result.items.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((p) => (
              <li key={p.id}><ProductCard product={p} /></li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-16 text-center">
            <p className="text-lg font-bold text-navy-950">No products match your search</p>
            <p className="mt-2 text-ink-muted">Try a different composition or clear filters — or ask our team, we may have it in our extended range.</p>
            <Button className="mt-6" variant="outline" onClick={clear}>Clear search</Button>
          </div>
        )}
      </div>

      {result.pages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => set("page", result.page - 1)}>Previous</Button>
          <span className="px-3 text-sm text-ink-muted">Page {result.page} of {result.pages}</span>
          <Button variant="outline" size="sm" disabled={result.page >= result.pages} onClick={() => set("page", result.page + 1)}>Next</Button>
        </nav>
      )}
    </div>
  );
}
