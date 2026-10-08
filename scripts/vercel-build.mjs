// Production build used by Vercel (`vercel-build` script) and any CI/host.
// 1. Fails fast with clear instructions when required env vars are missing
// 2. Applies database migrations and the idempotent seed
// 3. Builds the Next.js app (pages are pre-rendered from the database)
import { execSync } from "node:child_process";

const env = { ...process.env };
// Supabase/Neon: DIRECT_URL is the non-pooled URL used for migrations. Fall back to DATABASE_URL.
env.DIRECT_URL ||= env.DATABASE_URL;

const problems = [];
if (!env.DATABASE_URL) problems.push("DATABASE_URL   – PostgreSQL connection string (e.g. Supabase → Project Settings → Database → Connection string)");
if (!env.AUTH_SECRET || env.AUTH_SECRET.length < 32) problems.push("AUTH_SECRET    – random string, at least 32 characters (openssl rand -base64 48)");

if (problems.length) {
  console.error(`
┌──────────────────────────────────────────────────────────────────────────┐
│  Missing required environment variables                                  │
└──────────────────────────────────────────────────────────────────────────┘
${problems.map((p) => `  • ${p}`).join("\n")}

Add them in Vercel → Project → Settings → Environment Variables
(enable for Production, Preview and Development), then redeploy.
Recommended as well: DIRECT_URL, NEXT_PUBLIC_SITE_URL, SEED_ADMIN_EMAIL,
SEED_ADMIN_PASSWORD, IP_HASH_SALT. See README → Deployment.
`);
  process.exit(1);
}

const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
};

run("npx prisma generate");
run("npx prisma migrate deploy");
if (env.SKIP_SEED !== "1") run("npx prisma db seed");
run("npx next build");
