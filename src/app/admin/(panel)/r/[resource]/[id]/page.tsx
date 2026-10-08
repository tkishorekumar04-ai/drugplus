import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import { anyDelegate, relationOptions, scrub } from "@/lib/admin/data";
import { PageTitle } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/resource-form";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function EditResource({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const [{ resource, id }, session] = await Promise.all([params, getSession()]);
  const res = getResource(resource);
  if (!res || (res.adminOnly && session?.role !== "ADMIN")) notFound();
  const row = await anyDelegate(res.model).findUnique({ where: { id }, ...(res.include ? { include: res.include } : {}) });
  if (!row) notFound();
  const values = scrub(row);
  const label = String(values.name ?? values.title ?? values.label ?? res.singular);
  const cats = res.key === "products" ? ((values.categories as { categoryId: string }[]) ?? []).map((c) => c.categoryId) : [];
  const pub = res.publicPath?.(values);
  return (
    <>
      <Link href={`/admin/r/${res.key}`} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft className="h-4 w-4" aria-hidden /> {res.label}</Link>
      <PageTitle
        title={`Edit ${res.singular}`}
        description={label}
        actions={
          <>
            {pub && <a href={pub} target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold"><ExternalLink className="h-4 w-4" aria-hidden /> View</a>}
            <DeleteButton resourceKey={res.key} id={id} label={label} />
          </>
        }
      />
      {res.note && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{res.note}</p>}
      <ResourceForm resourceKey={res.key} id={id} fields={res.fields} values={JSON.parse(JSON.stringify(values))} relationOptions={await relationOptions(res)} selectedCategories={cats} />
    </>
  );
}
