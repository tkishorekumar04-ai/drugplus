import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seo.defaultTitle, template: s.seo.titleTemplate },
    description: s.seo.defaultDescription,
    applicationName: s.company.name,
    formatDetection: { telephone: false },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0D1E3F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
