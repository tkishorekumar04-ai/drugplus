import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const TYPES: { ext: string; mime: string; magic: (b: Buffer) => boolean }[] = [
  { ext: "png", mime: "image/png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: "jpg", mime: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "webp", mime: "image/webp", magic: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
  { ext: "avif", mime: "image/avif", magic: (b) => b.subarray(4, 12).toString() === "ftypavif" },
  { ext: "pdf", mime: "application/pdf", magic: (b) => b.subarray(0, 5).toString() === "%PDF-" },
];

const uploadDir = () => path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

/** Authenticated upload. Content type is verified by magic bytes (not the client-supplied type). */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const max = Number(process.env.MAX_UPLOAD_MB || 10) * 1024 * 1024;
  if (file.size > max) return NextResponse.json({ error: `File too large (max ${process.env.MAX_UPLOAD_MB || 10} MB)` }, { status: 413 });

  const buf = Buffer.from(await file.arrayBuffer());
  const type = TYPES.find((t) => t.magic(buf));
  if (!type) return NextResponse.json({ error: "Unsupported file type. Use PNG, JPG, WebP, AVIF or PDF." }, { status: 415 });

  const base = path.parse(file.name).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50) || "file";
  const name = `${base}-${randomBytes(5).toString("hex")}.${type.ext}`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return NextResponse.json({ url: `/uploads/${name}` });
}
