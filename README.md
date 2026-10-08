# DrugPlus — Pharmaceutical & PCD Franchise Website

A production-ready, conversion-focused website for an Indian pharmaceutical company. It covers PCD and monopoly franchise, product catalogue, third-party manufacturing and export, and comes with a built-in CMS and lead management.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style primitives · PostgreSQL · Prisma · React Hook Form · Zod · Framer Motion

---

## Features

| Area | What's included |
| --- | --- |
| **Public site** | Home (full conversion flow), About, Products (live search + filters), Product detail, printable Catalogue, PCD Franchise (primary conversion page), Therapeutic Areas, Quality & Manufacturing (gallery + lightbox), Export (world map), Certifications (PDF viewer), Blog (categories, articles, FAQ), Contact, Location pages, SEO landing pages and legal pages |
| **Conversion** | Hero lead form, franchise application, contact and product enquiry forms. Floating WhatsApp/Call buttons, a mobile sticky bar (Call · WhatsApp · Enquire) and prefilled WhatsApp messages |
| **Leads** | Every enquiry is stored in Postgres with UTM, GCLID, landing page, referrer and form source. The admin can search, filter, change status, add notes and export CSV (with formula-injection protection) |
| **CRM** | Optional fan-out to Zoho CRM, HubSpot, Google Sheets, a signed webhook (Zapier/Make/n8n) and WhatsApp Business API notifications. Failures are recorded on the lead and can be retried |
| **Admin / CMS** | Products, categories, therapeutic areas, blog posts and categories, testimonials, certificates, statistics, location pages, facility gallery, export markets, users, and site settings (contact numbers, WhatsApp, hero copy, SEO) |
| **Analytics** | GA4, GTM, Meta Pixel, Google Ads conversions and Microsoft Clarity. These load only after cookie consent. Events: page view, product view, product search, form start/submit, generate lead, franchise and contact enquiry, WhatsApp click, call click, catalogue download, document view |
| **SEO** | Per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards, a dynamic OG image, XML sitemap, robots.txt, and JSON-LD (Organization, WebSite + SearchAction, BreadcrumbList, Product, Article, FAQPage). Filtered search pages are `noindex` |
| **Security** | Zod validation on both client and server, honeypot, minimum fill time, Cloudflare Turnstile, per-IP rate limits (in memory plus a database check), Origin checks (CSRF), bcrypt passwords, signed httpOnly `SameSite=strict` session cookies, middleware-protected admin, upload type checks by magic bytes, security headers, and visitor IPs stored only as salted hashes |
| **Accessibility** | Semantic landmarks, skip link, one `h1` per page, labelled inputs with `aria-invalid`/`aria-describedby`, a focus-trapped mobile menu, keyboard-operable lightbox and dialogs, visible focus rings, `prefers-reduced-motion` support and AA colour contrast |

### Content integrity (pharma compliance)

The site is built so that it **cannot show unverified claims by accident**:

- **Statistics** are seeded *unpublished* with value `0`. They appear only after an admin enters verified numbers and ticks *Published*.
- **Certificates** (WHO-GMP, ISO, etc.) are seeded as *unverified, unpublished placeholders*. They are shown only when both *Verified* and *Published* are ticked.
- **Testimonials:** none are seeded. They show only when *Consent confirmed* and *Published* are both ticked.
- **Export markets:** only India is marked *Served*. Other regions are labelled "open to partnership enquiries" until you mark them served.
- **Product indications** are empty by default. The product page shows a neutral "prescribing information on request" note instead.
- A **pharmaceutical disclaimer** is shown in the footer, on product pages and on `/disclaimer`.

---

## Quick start (local)

Requirements: Node 20+, PostgreSQL 14+.

```bash
cp .env.example .env            # then edit DATABASE_URL, AUTH_SECRET, SEED_ADMIN_*
npm install
npx prisma migrate deploy       # or: npm run db:migrate (dev)
npm run db:seed                 # categories, sample catalogue, blog, locations, admin user
npm run dev                     # http://localhost:3000  ·  admin: /admin
```

The seed is **idempotent and non-destructive**: it never overwrites records you edited in the admin.

> **Sample data:** the seeded product catalogue (48 products) uses generic compositions with illustrative brand names. Replace it with the company's approved product list before launch.

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build && npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run db:migrate` | Create/apply a migration in development |
| `npm run db:deploy` | Apply migrations in production |
| `npm run db:seed` | Seed reference and sample data |
| `npm run db:studio` | Prisma Studio |
| `node tests/e2e.mjs` | End-to-end smoke tests against a running server (`npm i --no-save playwright` first; set `BASE_URL`) |

---

## Environment variables

All variables are documented in [`.env.example`](.env.example). Credentials are **never** stored in the database or committed.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical origin, e.g. `https://www.example.com` |
| `DATABASE_URL`, `DIRECT_URL` | ✅ | Postgres. On Supabase use the pooled URL for `DATABASE_URL` and the direct URL for `DIRECT_URL` |
| `AUTH_SECRET` | ✅ | 32+ random chars (`openssl rand -base64 48`) |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | seed | First admin account |
| `IP_HASH_SALT` | ✅ | Salt for hashing visitor IPs |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | recommended | Cloudflare Turnstile on all public forms |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` | optional | Analytics. Leave blank to disable |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET` | optional | Signed JSON webhook (`X-Signature` = HMAC-SHA256 of body) |
| `GOOGLE_SHEETS_WEBHOOK_URL` | optional | Apps Script web app (see below) |
| `HUBSPOT_ACCESS_TOKEN` | optional | Private app token with `crm.objects.contacts.write` |
| `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ACCOUNTS_URL`, `ZOHO_API_DOMAIN` | optional | Zoho CRM Leads module (India DC defaults) |
| `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO`, `WHATSAPP_TEMPLATE_NAME` | optional | WhatsApp Cloud API alert to your sales number on each lead |
| `UPLOAD_DIR`, `MAX_UPLOAD_MB` | optional | Local upload storage (default `./uploads`, served at `/uploads/*`) |

The **public phone and WhatsApp numbers**, the default WhatsApp message, address, map, hero copy and SEO defaults are edited in **Admin → Settings**. They are not environment variables.

---

## Deployment

### Vercel + Supabase (recommended)

1. In Supabase, open **Connect** (top bar) → **ORMs → Prisma** and copy both connection strings, using your **database password** (not the API keys):
   - `DATABASE_URL` = transaction pooler, port **6543**, ending in `?pgbouncer=true&connection_limit=1`
   - `DIRECT_URL` = session pooler, port **5432** (used for migrations)
2. In Vercel → Project → Settings → Environment Variables, add at least `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (10+ chars) and `IP_HASH_SALT`. `NEXT_PUBLIC_SITE_URL` falls back to the Vercel production URL until you set your own domain.
3. Deploy. `npm run build` (`scripts/build.mjs`) checks the required variables, on Vercel/CI applies migrations and runs the idempotent seed, then builds. If you set only `DATABASE_URL` (pooler port 6543), the migration URL is derived automatically. If a variable is missing, the build stops with a message naming it. Set `SKIP_SEED=1` to skip seeding.
4. **Uploads on Vercel:** the serverless filesystem is ephemeral. Upload images and PDFs to Supabase Storage, S3 or Cloudinary and paste the `https://` URL into the admin field (the field accepts URLs). Add your storage host to `images.remotePatterns` in `next.config.ts` if it is not already listed.
5. Add your domain and enable Vercel Analytics or Speed Insights if wanted.

Pages use ISR (5–10 min) and are revalidated instantly whenever content is saved in the admin.

### VPS / Docker / any Node host

```bash
npm ci && npx prisma migrate deploy && npm run build
npm start   # behind nginx/Caddy with HTTPS; uploads persist in ./uploads
```

Put a CDN (e.g. Cloudflare) in front for caching. Static assets are served with `immutable` cache headers.

> **Rate limiting across instances:** the per-IP burst limiter is in memory. Lead submissions are also capped per hashed IP per hour against the database, so that check holds across serverless instances. For stricter global limits, swap `src/lib/rate-limit.ts` for Upstash Redis.

---

## CRM integrations

Every lead is **stored in Postgres first**. CRM delivery then runs after the response is sent (`after()`), so a CRM outage never loses a lead. Sync status and errors appear on each lead in the admin, with a *Retry sync* button.

**Google Sheets (no service account needed):** create a Sheet → *Extensions → Apps Script*, paste the script below, then *Deploy → New deployment → Web app* (execute as you, access: anyone). Put the URL in `GOOGLE_SHEETS_WEBHOOK_URL`.

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActive().getSheets()[0];
  const row = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(row));
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((h) => row[h] ?? ""));
  return ContentService.createTextOutput("ok");
}
```

**Adding another CRM:** implement `CrmProvider` (`src/lib/crm/types.ts`) and register it in `src/lib/crm/index.ts`.

---

## Analytics events

All events go through `track()` in `src/lib/analytics.ts`. It pushes to `dataLayer` (GTM), `gtag` (GA4), `fbq` (Meta) and Clarity, and fires the Google Ads conversion on `generate_lead`. UTM parameters and `gclid` are captured on landing, kept for 30 days and attached to every lead and event.

`page_view` · `product_view` · `product_search` · `form_start` · `form_submit` · `generate_lead` · `franchise_enquiry` · `contact_enquiry` · `whatsapp_click` · `call_click` · `catalogue_download` · `document_view`

In GTM, create triggers on these custom events. Mark `generate_lead` as a key event in GA4.

---

## Project structure

```
prisma/                schema, migrations, seed (+ seed-data/ catalogue & editorial content)
src/app/(site)/        public pages (ISR)
src/app/admin/         admin login + panel (dashboard, leads, generic CRUD, settings)
src/app/api/           leads, product search, admin upload & CSV export
src/components/        ui/ (primitives) · layout/ · sections/ · forms/ · products/ · shared/ · admin/
src/lib/               db, settings, seo/jsonld, auth, validation, rate-limit, turnstile, analytics, crm/, admin/
tests/e2e.mjs          Playwright smoke tests
```

The admin CRUD is **config-driven**: to add a field or a whole content type, edit `src/lib/admin/resources.ts` (plus the Prisma schema).

---

## Launch checklist

The admin dashboard tracks most of these automatically.

- [ ] Replace sample products with the company-approved catalogue (and product photos)
- [ ] Settings: real phone, WhatsApp, address, map, legal name, GSTIN / drug licence, logo
- [ ] Enter **verified** statistics and publish them
- [ ] Upload real certificates and tick *Verified* (delete placeholders the company doesn't hold)
- [ ] Review the *Why Choose Us* copy (e.g. "WHO-GMP Manufacturing") and hero badges against actual certifications. Edit `src/components/sections/why-choose.tsx` and Settings → hero badges
- [ ] Mark export markets as *Served* only where applicable
- [ ] Add genuine testimonials with consent
- [ ] Upload real facility photography to the gallery (replaces the illustrated placeholders)
- [ ] Have legal counsel review `/privacy-policy`, `/terms-and-conditions`, `/disclaimer` (`src/lib/legal.ts`)
- [ ] Configure Turnstile, GA4/GTM, Search Console (submit `/sitemap.xml`), and your CRM
- [ ] Change the seeded admin password (Admin → Users)
