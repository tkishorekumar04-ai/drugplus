import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DOSAGE_FORMS, PRODUCTS, RANGES, THERAPEUTIC_AREAS } from "./seed-data/catalogue";
import { BLOG_CATEGORIES, BLOG_POSTS, LOCATIONS } from "./seed-data/content";

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administrator", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✓ admin user: ${email}`);

  // ── Settings (only created if missing – never overwrites admin edits) ──
  await prisma.setting.upsert({ where: { key: "site" }, update: {}, create: { key: "site", value: {} } });

  // ── Categories ──────────────────────────────────────────────────────────
  for (const [i, c] of DOSAGE_FORMS.entries()) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, kind: "DOSAGE_FORM", sortOrder: i } });
  }
  for (const [i, c] of RANGES.entries()) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, kind: "RANGE", sortOrder: i } });
  }
  for (const [i, a] of THERAPEUTIC_AREAS.entries()) {
    await prisma.therapeuticArea.upsert({ where: { slug: a.slug }, update: {}, create: { ...a, sortOrder: i } });
  }
  console.log(`✓ ${DOSAGE_FORMS.length + RANGES.length} categories, ${THERAPEUTIC_AREAS.length} therapeutic areas`);

  const cats = Object.fromEntries((await prisma.category.findMany()).map((c) => [c.slug, c.id]));
  const areas = Object.fromEntries((await prisma.therapeuticArea.findMany()).map((a) => [a.slug, a.id]));

  // ── Products (sample catalogue) ─────────────────────────────────────────
  for (const [i, p] of PRODUCTS.entries()) {
    const formName = DOSAGE_FORMS.find((f) => f.slug === p.form)?.name.replace(/s$/, "") ?? "";
    const name = `${p.brand}${formName ? ` ${formName}` : ""}`;
    const slug = slugify(p.brand);
    const categoryIds = [p.form && cats[p.form], cats[p.range]].filter(Boolean) as string[];
    const specs: Prisma.InputJsonValue = [
      { label: "Dosage form", value: formName || "Powder" },
      { label: "Pack size", value: p.pack },
      { label: "Storage", value: "Store below 30°C in a dry place, protected from light (refer to label)." },
      { label: "Schedule / category", value: p.type ?? "Prescription (Rx)" },
    ];
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
        brand: p.brand,
        composition: p.composition,
        productType: p.type ?? "Prescription (Rx)",
        packSize: p.pack,
        strengths: p.strengths,
        description: `${p.brand} contains ${p.composition}. Available for PCD / monopoly franchise and distribution partners. Detailed product information is provided to healthcare professionals and trade partners on request.`,
        keyInformation: "- Product literature available for healthcare professionals on request\n- Batch documentation shared with trade partners\n- Promotional inputs available for franchise partners",
        specifications: specs,
        isFeatured: Boolean(p.featured),
        sortOrder: i,
        therapeuticAreaId: areas[p.area],
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
      },
    });
  }
  console.log(`✓ ${PRODUCTS.length} sample products`);

  // ── Blog ───────────────────────────────────────────────────────────────
  for (const [i, c] of BLOG_CATEGORIES.entries()) {
    await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, sortOrder: i } });
  }
  const blogCats = Object.fromEntries((await prisma.blogCategory.findMany()).map((c) => [c.slug, c.id]));
  for (const p of BLOG_POSTS) {
    const { daysAgo, category, faq, ...rest } = p;
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        status: "PUBLISHED",
        publishedAt: new Date(Date.now() - daysAgo * 86_400_000),
        categoryId: blogCats[category],
        faq: faq.length ? faq : undefined,
      },
    });
  }
  console.log(`✓ ${BLOG_POSTS.length} blog posts`);

  // ── Location landing pages ─────────────────────────────────────────────
  for (const l of LOCATIONS) {
    await prisma.location.upsert({
      where: { slug: l.slug },
      update: {},
      create: { ...l, isPublished: true, seoTitle: `${l.headline} | Monopoly Rights Available`, seoDescription: l.intro.slice(0, 158) },
    });
  }
  console.log(`✓ ${LOCATIONS.length} location pages`);

  // ── Statistics: placeholders, UNPUBLISHED until verified by the company ──
  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({
      data: [
        { label: "Years Experience", value: 0, suffix: "+", sortOrder: 0 },
        { label: "Products", value: 0, suffix: "+", sortOrder: 1 },
        { label: "Franchise Partners", value: 0, suffix: "+", sortOrder: 2 },
        { label: "Therapeutic Segments", value: 0, suffix: "+", sortOrder: 3 },
        { label: "Countries Served", value: 0, suffix: "+", sortOrder: 4 },
      ].map((s) => ({ ...s, isPublished: false })),
    });
  }
  console.log("✓ stats (unpublished — enter verified values in Admin → Statistics)");

  // ── Certificates: placeholders, UNVERIFIED & UNPUBLISHED ────────────────
  if ((await prisma.certificate.count()) === 0) {
    await prisma.certificate.createMany({
      data: [
        { title: "WHO-GMP", type: "CERTIFICATE" as const, sortOrder: 0 },
        { title: "ISO 9001:2015", type: "CERTIFICATE" as const, sortOrder: 1 },
        { title: "Drug Manufacturing / Wholesale Licence", type: "LICENSE" as const, sortOrder: 2 },
        { title: "FSSAI Licence (Nutraceuticals)", type: "LICENSE" as const, sortOrder: 3 },
        { title: "GST Registration", type: "COMPANY_DOCUMENT" as const, sortOrder: 4 },
      ].map((c) => ({ ...c, isVerified: false, isPublished: false, description: "Placeholder — upload the actual document and tick Verified before publishing." })),
    });
  }
  console.log("✓ certificate placeholders (hidden until verified)");

  // ── Facility gallery: illustrated placeholders, replace with real photos ─
  if ((await prisma.galleryImage.count()) === 0) {
    await prisma.galleryImage.createMany({
      data: [
        { title: "Manufacturing", caption: "Production under documented GMP practices", imageUrl: "illustration:manufacturing" },
        { title: "Laboratory", caption: "Analytical and formulation laboratory", imageUrl: "illustration:laboratory" },
        { title: "Quality Testing", caption: "Batch-wise quality control", imageUrl: "illustration:quality" },
        { title: "Packaging", caption: "Compliant, tamper-evident packaging", imageUrl: "illustration:packaging" },
        { title: "Research", caption: "Formulation development", imageUrl: "illustration:research" },
        { title: "Warehouse", caption: "Controlled storage and dispatch", imageUrl: "illustration:warehouse" },
      ].map((g, i) => ({ ...g, sortOrder: i, section: "facility" })),
    });
  }

  // ── Export markets: India served; others marked as prospective only ─────
  if ((await prisma.exportMarket.count()) === 0) {
    await prisma.exportMarket.createMany({
      data: [
        { name: "India", region: "South Asia", status: "SERVED", latitude: 21.5, longitude: 78.9, sortOrder: 0 },
        { name: "Middle East", region: "GCC", status: "PROSPECTIVE", latitude: 24.5, longitude: 50.5, sortOrder: 1 },
        { name: "Africa", region: "East & West Africa", status: "PROSPECTIVE", latitude: 2, longitude: 22, sortOrder: 2 },
        { name: "Southeast Asia", region: "ASEAN", status: "PROSPECTIVE", latitude: 11, longitude: 106, sortOrder: 3 },
        { name: "CIS", region: "Central Asia", status: "PROSPECTIVE", latitude: 44, longitude: 66, sortOrder: 4 },
      ],
    });
  }
  console.log("✓ gallery & export markets");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
