import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "dp_admin";

async function valid(token?: string) {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const ok = await valid(req.cookies.get(COOKIE)?.value);
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/admin")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname !== "/admin" ? `?next=${encodeURIComponent(pathname)}` : "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
