import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { LEAD_STATUS_LABEL } from "@/lib/constants";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, children, className, actions }: { title?: string; children: React.ReactNode; className?: string; actions?: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white", className)}>
      {title && (
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <h2 className="font-bold text-navy-950">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-brand-50 text-brand-700 ring-brand-100",
  CONTACTED: "bg-amber-50 text-amber-800 ring-amber-200",
  QUALIFIED: "bg-violet-50 text-violet-700 ring-violet-200",
  FOLLOW_UP: "bg-orange-50 text-orange-700 ring-orange-200",
  CONVERTED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  LOST: "bg-slate-100 text-slate-600 ring-slate-200",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  DRAFT: "bg-amber-50 text-amber-800 ring-amber-200",
  ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-200",
  SERVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PROSPECTIVE: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", STATUS_STYLE[status] ?? "bg-navy-50 text-navy-700 ring-navy-100")}>
      {LEAD_STATUS_LABEL[status as keyof typeof LEAD_STATUS_LABEL] ?? status.replace(/_/g, " ")}
    </span>
  );
}

export function StatCard({ label, value, href, hint }: { label: string; value: number | string; href?: string; hint?: string }) {
  const body = (
    <>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums text-navy-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="rounded-2xl border border-line bg-white p-5 transition hover:shadow-card">{body}</Link>
  ) : (
    <div className="rounded-2xl border border-line bg-white p-5">{body}</div>
  );
}

export const dt = (d: Date | null | undefined) => (d ? formatDate(d, { dateStyle: "medium", timeStyle: "short" }) : "—");
