import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/reveal";

type Area = { id: string; name: string; slug: string; description: string | null; icon: string | null; _count?: { products: number } };

export function TherapeuticGrid({ areas }: { areas: Area[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {areas.map((a, i) => (
        <Reveal as="li" key={a.id} delay={(i % 4) * 0.04}>
          <Link
            href={`/therapeutic-areas/${a.slug}`}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
          >
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal-500 to-brand-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-teal-50 to-brand-50 text-teal-700 ring-1 ring-inset ring-teal-100">
              <Icon name={a.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-navy-950">{a.name}</h3>
            {a.description && <p className="mt-2 line-clamp-3 text-[0.93rem] leading-relaxed text-ink-muted">{a.description}</p>}
            <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-brand-600">
              Explore Products{a._count?.products ? ` (${a._count.products})` : ""} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
