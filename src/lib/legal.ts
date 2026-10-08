import type { SiteSettings } from "./settings";

type Doc = { title: string; description: string; body: (s: SiteSettings) => string };

/** Template legal copy — have it reviewed by your legal counsel before launch. */
export const LEGAL: Record<string, Doc> = {
  "privacy-policy": {
    title: "Privacy Policy",
    description: "How we collect, use and protect personal information submitted through this website.",
    body: (s) => `This Privacy Policy explains how **${s.company.legalName}** ("we", "us") collects and uses personal information when you use this website.

## Information we collect

- **Enquiry information** you submit through our forms: name, phone number, email, city/state, business details and your message.
- **Attribution data** such as the page you landed on and campaign parameters (UTM), used to understand how visitors find us.
- **Technical data** such as browser type. We store a one-way hash of your IP address for spam prevention — not the IP address itself.
- **Analytics cookies**, only if you accept them in the cookie banner.

## How we use information

- To respond to your enquiry and discuss business opportunities.
- To prevent spam and abuse of our forms.
- To improve our website and marketing (only with consent for analytics cookies).

We may store enquiry details in our CRM and messaging tools used by our sales team. We do **not** sell personal information.

## Retention

Enquiry data is retained for as long as needed for the business relationship or as required by law. You can request deletion at any time.

## Your rights

You may request access, correction or deletion of your personal data, or withdraw consent, by emailing **${s.contact.email}**. We process personal data in accordance with applicable Indian law, including the Digital Personal Data Protection Act, 2023.

## Contact

${s.company.legalName}, ${s.contact.address}. Email: ${s.contact.email}`,
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    description: "Terms governing the use of this website.",
    body: (s) => `By using this website you agree to these terms.

## Use of the website

Content on this website is provided for general business information for healthcare professionals, trade partners and business enquirers. It does not constitute an offer; franchise, supply and manufacturing arrangements are governed solely by written agreements.

## Product information

Product details are provided for reference. Compositions, packaging and availability may change and are subject to applicable regulatory approvals. Prices and commercial terms are shared on request.

## Intellectual property

All trademarks, logos, text and graphics on this website belong to ${s.company.legalName} or their respective owners and may not be used without permission.

## Limitation of liability

We make reasonable efforts to keep information accurate but do not warrant that it is complete or current. We are not liable for any loss arising from reliance on website content.

## Governing law

These terms are governed by the laws of India. Courts at ${s.contact.city || "our registered office location"} shall have jurisdiction.`,
  },
  disclaimer: {
    title: "Disclaimer",
    description: "Medical and business disclaimer for this website.",
    body: (s) => `${s.disclaimer}

## No medical advice

Nothing on this website is intended to diagnose, treat, cure or prevent any disease, or to replace advice from a qualified healthcare professional. Do not self-medicate. Prescription medicines must only be used on the advice of a registered medical practitioner.

## Business information

Statements about franchise opportunities describe our general approach. Actual territories, terms and support are confirmed in writing. Business outcomes depend on many factors and are not guaranteed.

## External links

Links to third-party websites are provided for convenience; we are not responsible for their content.`,
  },
  "cookie-policy": {
    title: "Cookie Policy",
    description: "How this website uses cookies and similar technologies.",
    body: () => `## Essential storage

We use first-party browser storage to remember your cookie choice and to keep campaign attribution (UTM parameters) for up to 30 days so we know which campaign brought you to us when you submit an enquiry.

## Analytics & advertising cookies (optional)

If you select **Accept all**, we may load: Google Analytics 4, Google Tag Manager, Google Ads conversion tracking, Meta Pixel and Microsoft Clarity. These help us measure site usage and the effectiveness of our advertising.

If you select **Essential only**, these tools are not loaded.

## Changing your choice

Clear this site's data in your browser to see the cookie banner again and change your preference.`,
  },
};
