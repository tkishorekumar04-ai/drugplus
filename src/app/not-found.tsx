import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import "@fontsource-variable/manrope";

export default function NotFound() {
  return (
    <main className="grid min-h-[80vh] place-items-center bg-surface px-4 py-20">
      <div className="max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Error 404</p>
        <h1 className="mt-3 text-display-md text-navy-950">We couldn&apos;t find that page</h1>
        <p className="mt-4 text-ink-muted">The page may have moved. Try searching our products or head back to the homepage.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-navy-900 px-5 font-semibold text-white"><ArrowLeft className="h-4 w-4" aria-hidden /> Back to home</Link>
          <Link href="/products" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-navy-900"><Search className="h-4 w-4" aria-hidden /> Search products</Link>
        </div>
      </div>
    </main>
  );
}
