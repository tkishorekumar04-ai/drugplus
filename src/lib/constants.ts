export const INTEREST_OPTIONS = [
  { value: "FRANCHISE", label: "PCD Pharma Franchise" },
  { value: "MONOPOLY", label: "Monopoly Franchise" },
  { value: "DISTRIBUTOR", label: "Distributor Opportunity" },
  { value: "MANUFACTURING", label: "Third-Party Manufacturing" },
  { value: "EXPORT", label: "Export" },
  { value: "PRODUCT", label: "Product Enquiry" },
  { value: "OTHER", label: "Other" },
] as const;

export const BUSINESS_TYPES = [
  "Pharma Distributor / Stockist",
  "Medical Representative / PCD Associate",
  "Pharmacy / Chemist",
  "Hospital / Clinic",
  "Doctor / Healthcare Professional",
  "Pharma Company / Marketer",
  "Importer / International Buyer",
  "New Business / Startup",
  "Other",
] as const;

export const EXPERIENCE_OPTIONS = ["New to pharma business", "Less than 2 years", "2 – 5 years", "5 – 10 years", "More than 10 years"] as const;

export const INVESTMENT_OPTIONS = ["Below ₹1 Lakh", "₹1 – 3 Lakh", "₹3 – 5 Lakh", "₹5 – 10 Lakh", "Above ₹10 Lakh"] as const;

export const CONTACT_ENQUIRY_TYPES = [
  "PCD Pharma Franchise",
  "Monopoly Franchise",
  "Distributor Opportunity",
  "Third-Party Manufacturing",
  "Export / International",
  "Product Information",
  "Careers",
  "Other",
] as const;

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Outside India",
] as const;

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "FOLLOW_UP", "CONVERTED", "LOST"] as const;
export const LEAD_TYPES = ["FRANCHISE", "MONOPOLY", "DISTRIBUTOR", "MANUFACTURING", "EXPORT", "PRODUCT", "CONTACT", "OTHER"] as const;

export const LEAD_STATUS_LABEL: Record<(typeof LEAD_STATUSES)[number], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  FOLLOW_UP: "Follow-up",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const LEAD_TYPE_LABEL: Record<(typeof LEAD_TYPES)[number], string> = {
  FRANCHISE: "PCD Franchise",
  MONOPOLY: "Monopoly Franchise",
  DISTRIBUTOR: "Distributor",
  MANUFACTURING: "Third-Party Mfg.",
  EXPORT: "Export",
  PRODUCT: "Product",
  CONTACT: "Contact",
  OTHER: "Other",
};

export const PRODUCT_TYPES = ["Prescription (Rx)", "OTC", "Nutraceutical", "Cosmetic / Derma Care"] as const;
