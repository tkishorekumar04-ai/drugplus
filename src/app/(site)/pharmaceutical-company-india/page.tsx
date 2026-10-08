import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LANDING } from "@/lib/landing-pages";
import { SeoLanding } from "@/components/sections/seo-landing";

export const revalidate = 600;
const c = LANDING["pharmaceutical-company-india"];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: c.title, description: c.description, path: c.path, absoluteTitle: true });
}

export default function Page() {
  return <SeoLanding c={c} />;
}
