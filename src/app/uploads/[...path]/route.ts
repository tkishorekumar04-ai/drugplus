import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", avif: "image/avif", pdf: "application/pdf" };

/** Serves files uploaded through the admin (stored outside /public so they work after `next build`). */
export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const root = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
  const file = path.resolve(root, ...parts);
  if (!file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  const ext = path.extname(file).slice(1).toLowerCase();
  if (!MIME[ext]) return new Response("Not found", { status: 404 });
  try {
    await stat(file);
    const body = await readFile(file);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": MIME[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        ...(ext === "pdf" ? { "Content-Disposition": `inline; filename="${path.basename(file)}"` } : {}),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
