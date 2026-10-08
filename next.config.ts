import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Allow images from your object storage / CDN (e.g. Supabase Storage). Adjust as needed.
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async rewrites() {
    // SEO-friendly location URLs: /pharma-franchise-hyderabad → /locations/hyderabad
    // Static routes such as /pharma-franchise-company take precedence over this rewrite.
    return [{ source: "/pharma-franchise-:slug", destination: "/locations/:slug" }];
  },
  async redirects() {
    return [
      { source: "/locations/:slug", destination: "/pharma-franchise-:slug", permanent: true },
      { source: "/franchise", destination: "/pcd-pharma-franchise", permanent: true },
    ];
  },
};

export default nextConfig;
