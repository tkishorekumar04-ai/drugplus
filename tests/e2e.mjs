// End-to-end smoke tests (Playwright). Usage: BASE_URL=http://localhost:3000 node tests/e2e.mjs
import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ChangeMe!2026";
const exe = process.env.CHROMIUM_PATH;
const RUN = Date.now().toString(36).replace(/[0-9]/g, (d) => "abcdefghij"[d]); // letters only (name validation)
const LEAD_NAME = `Priya Reddy ${RUN}`;

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const results = [];
async function test(name, fn) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("dp_consent", "essential"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await fn(page, ctx);
    assert.deepEqual(errors, [], `page errors: ${errors.join("; ")}`);
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", name, e.message.split("\n")[0]]);
  } finally {
    await ctx.close();
  }
}
const events = (page) => page.evaluate(() => (window.dataLayer || []).map((e) => e.event).filter(Boolean));

await test("Home: hero lead form validates and submits (with UTM attribution)", async (page) => {
  await page.goto(`${BASE}/?utm_source=e2e&utm_medium=test&utm_campaign=smoke`);
  const form = page.locator("#enquiry form");
  await form.getByRole("button", { name: /Request Business Details/ }).click();
  await assert.ok(await form.getByText("Please enter your full name").isVisible());
  await form.getByLabel("Full Name").fill(LEAD_NAME);
  await form.getByLabel("Mobile Number").fill("9123456780");
  await form.getByLabel("Email").fill("priya@example.com");
  await form.getByLabel("City / State").fill("Karimnagar, Telangana");
  await form.getByLabel("Business Type").selectOption({ index: 1 });
  await form.getByLabel("Interested In").selectOption("MONOPOLY");
  await page.waitForTimeout(2600); // anti-bot minimum fill time
  await form.getByRole("button", { name: /Request Business Details/ }).click();
  await page.getByText("Our business development team will contact you shortly.").waitFor({ timeout: 8000 });
  const ev = await events(page);
  for (const e of ["page_view", "form_start", "form_submit", "generate_lead"]) assert.ok(ev.includes(e), `missing ${e} in ${ev}`);
});

await test("Franchise page: application form submits with success message", async (page) => {
  await page.goto(`${BASE}/pcd-pharma-franchise#apply`);
  const f = page.locator("#apply form");
  await f.getByLabel("Name").fill("Mohammed Irfan");
  await f.getByLabel("Mobile").fill("9988776655");
  await f.getByLabel("Email").fill("irfan@example.com");
  await f.getByLabel("State").selectOption("Karnataka");
  await f.getByLabel("City").fill("Mysuru");
  await f.getByLabel("Preferred Territory").fill("Mysuru & Mandya");
  await f.getByLabel("Business Experience").selectOption({ index: 3 });
  await f.getByLabel("Investment Range").selectOption({ index: 2 });
  await f.getByLabel("Interested Product Segment").selectOption({ index: 2 });
  await page.waitForTimeout(2600);
  await f.getByRole("button", { name: /Apply Now/ }).click();
  await page.getByText("Thank you.").waitFor({ timeout: 8000 });
  assert.ok((await events(page)).includes("franchise_enquiry"));
});

await test("Contact page: contact form submits", async (page) => {
  await page.goto(`${BASE}/contact`);
  await page.getByLabel("Name").fill("Lakshmi Iyer");
  await page.getByLabel("Phone").fill("9445566778");
  await page.getByLabel("Email").fill("lakshmi@example.com");
  await page.getByLabel("Enquiry Type").selectOption("Third-Party Manufacturing");
  await page.getByLabel("Message").fill("We want to launch 10 products under our brand.");
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: /Send Enquiry/ }).click();
  await page.getByText("Thank you for reaching out.").waitFor({ timeout: 8000 });
});

await test("Products: live search, filters and URL sync", async (page) => {
  await page.goto(`${BASE}/products`);
  const total = await page.getByText(/products? found/).textContent();
  await page.getByPlaceholder("Search medicine, composition or product...").fill("domperidone");
  await page.waitForResponse((r) => r.url().includes("/api/products?q=domperidone"));
  await page.waitForTimeout(300);
  const cards = await page.locator("main ul li article").count();
  assert.ok(cards >= 2 && cards < 10, `domperidone results: ${cards}`);
  assert.ok(page.url().includes("q=domperidone"));
  await page.getByLabel("Filter by dosage form").selectOption("capsules");
  await page.waitForResponse((r) => r.url().includes("form=capsules"));
  await page.waitForTimeout(300);
  assert.ok((await events(page)).includes("product_search"));
  await page.getByRole("button", { name: "Clear all" }).click();
  await page.waitForTimeout(600);
  assert.equal(await page.getByText(/products? found/).textContent(), total);
});

await test("Product detail: schema, enquiry CTA, product_view event", async (page) => {
  await page.goto(`${BASE}/products/telplus-am`);
  assert.ok(await page.getByRole("heading", { level: 1, name: /Telplus-AM/ }).isVisible());
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  assert.ok(ld.some((x) => x.includes('"@type":"Product"')) && ld.some((x) => x.includes("BreadcrumbList")));
  assert.ok(await page.getByRole("heading", { name: "Enquire About This Product" }).isVisible());
  assert.ok((await events(page)).includes("product_view"));
});

await test("WhatsApp CTA: prefilled message + click tracking", async (page) => {
  await page.goto(`${BASE}/`);
  const href = await page.locator('a[aria-label="Chat on WhatsApp"]').getAttribute("href");
  assert.match(href, /^https:\/\/wa\.me\/\d+\?text=Hello%2C%20I%20am%20interested%20in%20your%20PCD%20Pharma%20Franchise/);
  await page.locator('a[aria-label="Chat with us on WhatsApp"]').evaluate((a) => a.addEventListener("click", (e) => e.preventDefault()));
  await page.locator('a[aria-label="Chat with us on WhatsApp"]').click();
  assert.ok((await events(page)).includes("whatsapp_click"));
});

await test("Mobile: hamburger menu, sticky bottom bar, keyboard Escape", async (page, ctx) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`);
  const bar = page.getByRole("navigation", { name: "Quick contact" });
  assert.ok(await bar.isVisible());
  for (const t of ["Call Now", "WhatsApp", "Enquire Now"]) assert.ok(await bar.getByText(t).isVisible());
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Site menu" });
  assert.ok(await menu.isVisible());
  await page.keyboard.press("Escape");
  assert.ok(await menu.isHidden());
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflow, false, "horizontal overflow on mobile");
  void ctx;
});

await test("SEO: unique titles, canonical, OG and robots on key pages", async (page) => {
  const titles = new Set();
  for (const p of ["/", "/products", "/pcd-pharma-franchise", "/pharma-franchise-hyderabad", "/blog/pcd-pharma-franchise-guide", "/contact"]) {
    await page.goto(`${BASE}${p}`);
    const title = await page.title();
    assert.ok(title && !titles.has(title), `duplicate/empty title on ${p}`);
    titles.add(title);
    assert.ok(await page.locator('link[rel="canonical"]').getAttribute("href"));
    assert.ok(await page.locator('meta[property="og:title"]').getAttribute("content"));
    assert.ok(await page.locator('meta[name="description"]').getAttribute("content"));
    assert.equal(await page.locator("h1").count(), 1, `h1 count on ${p}`);
  }
  await page.goto(`${BASE}/products?q=x`);
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
});

await test("Broken links: every internal link on key pages resolves", async (page) => {
  const seen = new Set();
  const bad = [];
  for (const p of ["/", "/pcd-pharma-franchise", "/products", "/blog", "/therapeutic-areas", "/pharma-franchise-locations"]) {
    await page.goto(`${BASE}${p}`);
    const links = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href").split("#")[0]));
    for (const l of links) {
      if (!l || seen.has(l)) continue;
      seen.add(l);
      const r = await page.request.get(`${BASE}${l}`, { maxRedirects: 0 });
      if (r.status() >= 400) bad.push(`${l} → ${r.status()}`);
    }
  }
  assert.deepEqual(bad, [], `broken: ${bad.join(", ")}`);
  results.push(["INFO", `checked ${seen.size} unique internal links`]);
});

await test("Admin: login, leads list, status change, CSV export, product CRUD, settings", async (page) => {
  await page.goto(`${BASE}/admin`);
  await page.getByLabel("Email").fill(ADMIN_EMAIL);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByText("Invalid email or password.").waitFor();
  await page.getByLabel("Password").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("heading", { name: "Dashboard" }).waitFor();

  await page.goto(`${BASE}/admin/leads?q=${RUN}`);
  assert.ok(await page.getByRole("link", { name: LEAD_NAME }).isVisible());
  await page.getByLabel("Lead status").first().selectOption("CONTACTED");
  await page.waitForTimeout(800);
  await page.goto(`${BASE}/admin/leads?status=CONTACTED&q=${RUN}`);
  assert.ok(await page.getByRole("link", { name: LEAD_NAME }).isVisible());

  const csv = await page.request.get(`${BASE}/api/admin/leads/export?q=${RUN}`);
  assert.equal(csv.status(), 200);
  const body = await csv.text();
  assert.ok(body.includes("UTM Campaign") && body.includes(LEAD_NAME) && body.includes("smoke"), "CSV content");

  await page.goto(`${BASE}/admin/r/products/new`);
  await page.getByLabel("Product name *").fill("E2E Testplus 500 Tablet");
  await page.getByLabel("Composition *").fill("Testamol 500 mg");
  await page.getByLabel("Status *").selectOption("PUBLISHED");
  await page.locator('input[name="categories"]').first().check();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByText("Saved successfully.").waitFor();
  const r = await page.request.get(`${BASE}/products/e2e-testplus-500-tablet`);
  assert.equal(r.status(), 200, "new product page should be live");
  const api = await (await page.request.get(`${BASE}/api/products?q=testamol`)).json();
  assert.equal(api.total, 1);
  await page.getByRole("link", { name: "E2E Testplus 500 Tablet" }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByText("Deleted.").waitFor();

  await page.goto(`${BASE}/admin/settings`);
  await page.getByLabel("Business hours").fill("Mon – Sat, 10:00 AM – 7:00 PM IST");
  await page.getByRole("button", { name: "Save settings" }).click();
  await page.getByText("Saved — the website has been updated.").waitFor();
  await page.goto(`${BASE}/contact`);
  assert.ok(await page.getByText("Mon – Sat, 10:00 AM – 7:00 PM IST").first().isVisible());
});

await test("Security: admin APIs reject anonymous requests", async (page) => {
  assert.equal((await page.request.get(`${BASE}/api/admin/leads/export`)).status(), 401);
  assert.equal((await page.request.post(`${BASE}/api/admin/upload`, { multipart: { file: { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") } } })).status(), 401);
  assert.equal((await page.request.post(`${BASE}/api/leads`, { data: {}, headers: { Origin: "https://evil.example" } })).status(), 403);
});

await browser.close();
for (const r of results) console.log(r.join("  "));
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.filter((r) => r[0] === "PASS").length} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
