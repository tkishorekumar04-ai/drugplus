// Production build. Used by `npm run build` (local, Vercel, any CI/host).
// 1. Loads .env when present and fails fast with clear instructions if required vars are missing
// 2. On Vercel / CI (or MIGRATE_ON_BUILD=1): applies migrations and the idempotent seed
// 3. Generates the Prisma client and builds Next.js (pages are pre-rendered from the database)
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

if (existsSync(".env")) process.loadEnvFile(".env"); // never overrides variables already set

const env = { ...process.env };
const onCi = Boolean(env.VERCEL || env.CI || env.MIGRATE_ON_BUILD === "1");

/** Supabase transaction pooler (port 6543) needs pgbouncer mode for Prisma. */
function poolerSafe(url) {
  try {
    const u = new URL(url);
    if (u.port === "6543" && !u.searchParams.has("pgbouncer")) u.searchParams.set("pgbouncer", "true");
    return u.toString();
  } catch {
    return url;
  }
}
/** Migrations can't run through the transaction pooler: derive the session pooler (port 5432). */
function directFrom(url) {
  try {
    const u = new URL(url);
    if (u.port === "6543") {
      u.port = "5432";
      u.searchParams.delete("pgbouncer");
      u.searchParams.delete("connection_limit");
    }
    return u.toString();
  } catch {
    return url;
  }
}

const problems = [];
if (!env.DATABASE_URL) {
  problems.push("DATABASE_URL  – PostgreSQL connection string. Supabase: Connect → ORMs → Prisma (use your DATABASE PASSWORD, not the API keys)");
} else if (!/^postgres(ql)?:\/\//.test(env.DATABASE_URL)) {
  problems.push("DATABASE_URL  – must start with postgresql:// (the Supabase project URL / API keys will not work here)");
}
if (onCi && (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32)) {
  problems.push("AUTH_SECRET   – random string, at least 32 characters (needed for admin login)");
}
if (problems.length) {
  console.error(`
┌──────────────────────────────────────────────────────────────────────────┐
│  Build stopped: missing or invalid environment variables                 │
└──────────────────────────────────────────────────────────────────────────┘
${problems.map((p) => `  • ${p}`).join("\n")}

Vercel → Project → Settings → Environment Variables → add them for
Production and Preview, then Deployments → Redeploy.
Also recommended: DIRECT_URL, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, IP_HASH_SALT.
`);
  process.exit(1);
}

env.DATABASE_URL = poolerSafe(env.DATABASE_URL);
env.DIRECT_URL ||= directFrom(env.DATABASE_URL);

const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
};

run("npx prisma generate");
if (onCi) {
  run("npx prisma migrate deploy");
  if (env.SKIP_SEED !== "1") run("npx prisma db seed");
}
run("npx next build");
