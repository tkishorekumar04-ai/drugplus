import "server-only";
import { prisma } from "@/lib/db";
import type { Resource } from "./resources";

type AnyDelegate = {
  findMany: (a: unknown) => Promise<Record<string, unknown>[]>;
  findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
  count: (a: unknown) => Promise<number>;
};
export const anyDelegate = (model: string) => (prisma as unknown as Record<string, AnyDelegate>)[model];

/** Never send password hashes to the client. */
export function scrub(row: Record<string, unknown>) {
  const { passwordHash: _ph, ...rest } = row;
  void _ph;
  return rest;
}

export async function listResource(res: Resource, q: string | undefined, page: number, pageSize = 30) {
  const where = q ? { OR: res.search.map((f) => ({ [f]: { contains: q, mode: "insensitive" } })) } : {};
  const d = anyDelegate(res.model);
  const [rows, total] = await Promise.all([
    d.findMany({ where, orderBy: res.orderBy, skip: (page - 1) * pageSize, take: pageSize, ...(res.include ? { include: res.include } : {}) }),
    d.count({ where }),
  ]);
  return { rows: rows.map(scrub), total, pages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function relationOptions(res: Resource) {
  const out: Record<string, { value: string; label: string }[]> = {};
  for (const f of res.fields) {
    if (f.type === "relation" && f.relation) {
      const rows = await anyDelegate(f.relation.model).findMany({ orderBy: { [f.relation.label]: "asc" }, select: { id: true, [f.relation.label]: true } });
      out[f.name] = rows.map((r) => ({ value: String(r.id), label: String(r[f.relation!.label]) }));
    }
    if (f.type === "categories") {
      const rows = await prisma.category.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] });
      out[f.name] = rows.map((r) => ({ value: r.id, label: `${r.kind === "DOSAGE_FORM" ? "Form" : "Range"} · ${r.name}` }));
    }
  }
  return out;
}
