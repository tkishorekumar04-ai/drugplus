import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { relationOptions } from "@/lib/admin/data";
import { PageTitle } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/resource-form";

const DEFAULTS: Record<string, unknown> = { status: "DRAFT", isPublished: true, sortOrder: 0 };

export default async function NewResource({ params }: { params: Promise<{ resource: string }> }) {
  const [{ resource }, session] = await Promise.all([params, getSession()]);
  const res = getResource(resource);
  if (!res || (res.adminOnly && session?.role !== "ADMIN")) notFound();
  const defaults = { ...DEFAULTS, ...(["testimonials", "certificates", "stats"].includes(res.key) ? { isPublished: false } : {}) };
  return (
    <>
      <Link href={`/admin/r/${res.key}`} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft className="h-4 w-4" aria-hidden /> {res.label}</Link>
      <PageTitle title={`New ${res.singular}`} />
      {res.note && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{res.note}</p>}
      <ResourceForm resourceKey={res.key} id={null} fields={res.fields} values={defaults} relationOptions={await relationOptions(res)} />
    </>
  );
}
