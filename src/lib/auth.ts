import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const SESSION_COOKIE = "dp_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12h

export type Session = { sub: string; email: string; name: string; role: "ADMIN" | "EDITOR" };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set (min 32 chars)");
  return new TextEncoder().encode(secret);
}

export async function signSession(s: Session) {
  return new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin server action / route handler. */
export async function requireAdmin(role?: "ADMIN") {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (role === "ADMIN" && session.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  // Always run a bcrypt compare to keep timing consistent
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!user || !ok) return null;
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = await signSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return user;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
