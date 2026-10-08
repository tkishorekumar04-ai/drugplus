import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export type BlogCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

const GRADS = ["from-navy-800 to-brand-700", "from-teal-700 to-navy-800", "from-brand-700 to-teal-600", "from-navy-900 to-teal-700"];

export function BlogCard({ post, index = 0 }: { post: BlogCardData; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.coverImageUrl ? (
          <Image src={post.coverImageUrl} alt="" fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className={`flex h-full w-full items-end bg-gradient-to-br ${GRADS[index % GRADS.length]} p-5`}>
            <div className="grid-pattern absolute inset-0" aria-hidden />
            <span className="relative line-clamp-2 max-w-[85%] text-lg font-bold leading-snug text-white/90">{post.title}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs">
          {post.category && <span className="rounded-full bg-teal-50 px-2.5 py-1 font-semibold text-teal-700">{post.category.name}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()} className="flex items-center gap-1 text-ink-subtle">
              <Calendar className="h-3.5 w-3.5" aria-hidden /> {formatDate(post.publishedAt)}
            </time>
          )}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-navy-950">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-muted">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600">
          Read More <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}
