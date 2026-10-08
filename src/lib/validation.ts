import { z } from "zod";
import { CONTACT_ENQUIRY_TYPES, INTEREST_OPTIONS } from "./constants";

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => trimmed(max).optional().or(z.literal("").transform(() => undefined));

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine((v) => /^(\+?\d{1,3})?\d{10}$/.test(v) || /^\+\d{8,15}$/.test(v), "Enter a valid mobile number");

export const nameSchema = trimmed(80)
  .min(2, "Please enter your full name")
  .regex(/^[\p{L}\p{M} .'-]+$/u, "Please use letters only");

const emailRequired = z.string().trim().toLowerCase().email("Enter a valid email address").max(120);
const emailOptional = z.string().trim().toLowerCase().email("Enter a valid email address").max(120).optional().or(z.literal("").transform(() => undefined));

const interestValues = INTEREST_OPTIONS.map((o) => o.value) as [string, ...string[]];

/** Tracking + anti-spam metadata appended to every form submission by the client. */
export const metaSchema = z.object({
  source: trimmed(60).default("website"),
  utmSource: optionalText(120),
  utmMedium: optionalText(120),
  utmCampaign: optionalText(160),
  utmTerm: optionalText(160),
  utmContent: optionalText(160),
  gclid: optionalText(200),
  landingPage: optionalText(500),
  pageUrl: optionalText(500),
  referrer: optionalText(500),
  // anti-spam
  company_website: z.string().max(0, "Spam detected").optional(), // honeypot – must be empty
  startedAt: z.coerce.number().optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export const quickLeadSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailRequired,
  location: trimmed(120).min(2, "Please enter your city / state"),
  businessType: trimmed(80).min(1, "Select your business type"),
  interestedIn: z.enum(interestValues, { errorMap: () => ({ message: "Select what you are interested in" }) }),
});

export const franchiseSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailRequired,
  state: trimmed(80).min(2, "Select your state"),
  city: trimmed(80).min(2, "Enter your city"),
  preferredTerritory: trimmed(160).min(2, "Enter your preferred territory"),
  businessExperience: trimmed(60).min(1, "Select your experience"),
  investmentRange: trimmed(60).min(1, "Select an investment range"),
  productSegment: trimmed(120).min(1, "Select a product segment"),
  franchiseType: z.enum(["FRANCHISE", "MONOPOLY"]).default("FRANCHISE"),
});

export const contactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailRequired,
  enquiryType: z.enum(CONTACT_ENQUIRY_TYPES as unknown as [string, ...string[]], { errorMap: () => ({ message: "Select an enquiry type" }) }),
  message: trimmed(2000).min(10, "Please tell us a little more (min. 10 characters)"),
});

export const productEnquirySchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailOptional,
  city: trimmed(80).min(2, "Enter your city"),
  message: optionalText(1000),
  productId: z.string().max(40),
  productName: optionalText(200),
});

export const leadPayloadSchema = z.discriminatedUnion("form", [
  z.object({ form: z.literal("quick"), data: quickLeadSchema, meta: metaSchema }),
  z.object({ form: z.literal("franchise"), data: franchiseSchema, meta: metaSchema }),
  z.object({ form: z.literal("contact"), data: contactSchema, meta: metaSchema }),
  z.object({ form: z.literal("product"), data: productEnquirySchema, meta: metaSchema }),
]);

export type QuickLeadInput = z.input<typeof quickLeadSchema>;
export type FranchiseInput = z.input<typeof franchiseSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ProductEnquiryInput = z.input<typeof productEnquirySchema>;
export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type LeadMeta = z.infer<typeof metaSchema>;
