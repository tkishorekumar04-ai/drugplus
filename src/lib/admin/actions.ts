"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Prisma, type LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword, login, logout, requireAdmin } from "@/lib/auth";
import { getResource, type Field } from "./resources";
import { slugify } from "@/lib/utils";
import { LEAD_STATUSES } from "@/lib/constants";
import { mergeSettings, SETTINGS_KEY, type SiteSettings } from "@/lib/settings";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { syncLeadToCrms } from "@/lib/crm";

export type FormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined;

type Delegate = {
  findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
  create: (a: unknown) => Promise<Record<string, unknown>>;
  update: (a: unknown) => Promise<Record<string, unknown>>;
  delete: (a: unknown) => Promise<unknown>;
};
const delegate = (model: string) => (prisma as unknown as Record<string, Delegate>)[model];

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  if (!rateLimit(`login:${ip}`, 8, 15 * 60_000).ok) return { error: "Too many attempts. Try again in 15 minutes." };
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };
  const user = await login(email, password);
  if (!user) return { error: "Invalid email or password." };
  const next = String(fd.get("next") || "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

// ─── Generic resource CRUD ────────────────────────────────────────────────

function parseSpecs(v: string) {
  return v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.indexOf(":");
      return i === -1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
    });
}

function parseFaq(v: string) {
  return v
    .split(/\n\s*\n/)
    .map((block) => {
      const q = block.match(/^\s*Q:\s*([\s\S]*?)\n\s*A:/m)?.[1]?.trim();
      const a = block.match(/\n\s*A:\s*([\s\S]*)$/m)?.[1]?.trim();
      return q && a ? { q, a } : null;
    })
    .filter(Boolean) as { q: string; a: string }[];
}

function coerce(field: Field, fd: FormData): { value?: unknown; error?: string; skip?: boolean } {
  const raw = fd.get(field.name);
  const str = typeof raw === "string" ? raw.trim() : "";
  switch (field.type) {
    case "boolean":
      return { value: raw === "on" || raw === "true" };
    case "number": {
      if (!str) return field.required ? { error: "Required" } : { value: field.name === "sortOrder" ? 0 : null };
      const n = Number(str);
      if (!Number.isFinite(n)) return { error: "Must be a number" };
      return { value: ["latitude", "longitude"].includes(field.name) ? n : Math.round(n) };
    }
    case "date":
      if (!str) return { value: null };
      return Number.isNaN(Date.parse(str)) ? { error: "Invalid date" } : { value: new Date(str) };
    case "specs":
      return { value: str ? parseSpecs(str) : Prisma.DbNull };
    case "faq": {
      if (!str) return { value: Prisma.DbNull };
      const faq = parseFaq(str);
      return faq.length ? { value: faq } : { error: "Use the format  Q: … / A: …" };
    }
    case "categories":
      return { skip: true };
    case "password":
      if (!str) return { skip: true };
      return str.length < 10 ? { error: "Min. 10 characters" } : { value: str };
    case "url":
    case "image":
    case "file":
      if (!str) return field.required ? { error: "Required" } : { value: null };
      if (!/^(https:\/\/|\/|illustration:)/.test(str)) return { error: "Must be an https:// URL or an uploaded file" };
      return { value: str };
    case "relation":
    case "select":
    case "icon":
      if (!str) return field.required ? { error: "Required" } : { value: null };
      if (field.options && !field.options.some((o) => o.value === str)) return { error: "Invalid option" };
      return { value: str };
    default:
      if (!str) return field.required ? { error: "Required" } : { value: field.type === "slug" ? "" : null };
      return { value: str.slice(0, field.type === "markdown" ? 100_000 : 5_000) };
  }
}

export async function saveResource(key: string, id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const res = getResource(key);
  if (!res) return { error: "Unknown resource" };
  if (res.adminOnly && session.role !== "ADMIN") return { error: "Only administrators can manage this." };

  const data: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};
  for (const f of res.fields) {
    const r = coerce(f, fd);
    if (r.error) fieldErrors[f.name] = r.error;
    else if (!r.skip) data[f.name] = r.value;
  }

  // Slugs: auto-generate from source field when empty
  for (const f of res.fields.filter((x) => x.type === "slug")) {
    const v = (data[f.name] as string) || slugify(String(data[f.slugFrom ?? "name"] ?? ""));
    if (!v) fieldErrors[f.name] = "Required";
    else data[f.name] = slugify(v);
    if (res.key === "locations" && ["company", "locations"].includes(String(data[f.name]))) fieldErrors[f.name] = "Reserved slug";
  }

  // Resource-specific rules
  if (res.key === "users") {
    data.email = String(data.email || "").toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(String(data.email))) fieldErrors.email = "Invalid email";
    if (data.password) data.passwordHash = await hashPassword(String(data.password));
    else if (!id) fieldErrors.password = "Required for new users";
    delete data.password;
  }
  if (res.key === "blog" && data.status === "PUBLISHED" && !data.publishedAt) data.publishedAt = new Date();

  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  try {
    const d = delegate(res.model);
    let saved: Record<string, unknown>;
    if (id) saved = await d.update({ where: { id }, data });
    else saved = await d.create({ data });

    if (res.key === "products") {
      const ids = fd.getAll("categories").map(String).filter(Boolean);
      await prisma.$transaction([
        prisma.productCategory.deleteMany({ where: { productId: String(saved.id) } }),
        prisma.productCategory.createMany({ data: ids.map((categoryId) => ({ productId: String(saved.id), categoryId })), skipDuplicates: true }),
      ]);
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const target = (e.meta?.target as string[] | undefined)?.[0] ?? "slug";
      return { error: "That value is already in use.", fieldErrors: { [target]: "Already in use" } };
    }
    console.error(e);
    return { error: "Could not save. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/r/${key}?saved=1`);
}

export async function deleteResource(key: string, id: string) {
  const session = await requireAdmin();
  const res = getResource(key);
  if (!res || (res.adminOnly && session.role !== "ADMIN")) throw new Error("Forbidden");
  if (res.key === "users" && id === session.sub) throw new Error("You cannot delete your own account");
  await delegate(res.model).delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`/admin/r/${key}?deleted=1`);
}

// ─── Leads ────────────────────────────────────────────────────────────────

export async function updateLeadStatus(id: string, status: string) {
  await requireAdmin();
  if (!LEAD_STATUSES.includes(status as LeadStatus)) throw new Error("Invalid status");
  await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadNotes(id: string, _: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { notes: String(fd.get("notes") || "").slice(0, 5000) || null } });
  revalidatePath(`/admin/leads/${id}`);
  return { ok: true };
}

export async function retryLeadSync(id: string) {
  await requireAdmin();
  const l = await prisma.lead.findUnique({ where: { id } });
  if (!l) return;
  await syncLeadToCrms({ ...l, createdAt: l.createdAt.toISOString() });
  revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(id: string) {
  await requireAdmin("ADMIN");
  await prisma.lead.delete({ where: { id } });
  redirect("/admin/leads");
}

// ─── Settings ─────────────────────────────────────────────────────────────

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const mapEmbedUrl = get("contact.mapEmbedUrl");
  if (mapEmbedUrl && !/^https:\/\/(www\.)?google\.com\/maps\/embed/.test(mapEmbedUrl)) {
    return { error: "Map embed URL must start with https://www.google.com/maps/embed", fieldErrors: { "contact.mapEmbedUrl": "Invalid embed URL" } };
  }
  for (const k of ["company.logoUrl", "hero.imageUrl", "about.imageUrl", "catalogueUrl", "seo.ogImageUrl", "social.linkedin", "social.facebook", "social.instagram", "social.youtube", "social.x"]) {
    const v = get(k);
    if (v && !/^(https:\/\/|\/)/.test(v)) return { error: `${k} must be an https:// URL or uploaded file`, fieldErrors: { [k]: "Invalid URL" } };
  }
  const nested: Record<string, unknown> = {};
  for (const [k, v] of fd.entries()) {
    if (k.startsWith("$") || typeof v !== "string") continue;
    const parts = k.split(".");
    let cur = nested;
    parts.slice(0, -1).forEach((p) => (cur = (cur[p] ??= {}) as Record<string, unknown>));
    cur[parts.at(-1)!] = v.trim();
  }
  const badges = get("hero.badges");
  (nested.hero as Record<string, unknown>).badges = badges ? badges.split("\n").map((b) => b.trim()).filter(Boolean).slice(0, 6) : [];
  const value = mergeSettings(nested) as SiteSettings;
  await prisma.setting.upsert({ where: { key: SETTINGS_KEY }, update: { value }, create: { key: SETTINGS_KEY, value } });
  revalidatePath("/", "layout");
  return { ok: true };
}
