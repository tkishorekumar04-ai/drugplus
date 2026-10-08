import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ name, logoUrl, tone = "dark", className }: { name: string; logoUrl?: string; tone?: "dark" | "light"; className?: string }) {
  if (logoUrl) {
    return <Image src={logoUrl} alt={name} width={160} height={40} className={cn("h-9 w-auto", className)} priority />;
  }
  const [first, ...rest] = name.split(" ");
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
        <rect width="40" height="40" rx="11" fill={tone === "light" ? "#fff" : "#0D1E3F"} />
        <path d="M13 11h8.5c5.5 0 9.5 3.9 9.5 9s-4 9-9.5 9H13z" fill="none" stroke={tone === "light" ? "#0D1E3F" : "#fff"} strokeWidth="3" />
        <path d="M17.5 20h7M21 16.5v7" stroke="#35B6A1" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className={cn("block text-[1.15rem] font-extrabold tracking-tight", tone === "light" ? "text-white" : "text-navy-950")}>{first}</span>
        {rest.length > 0 && (
          <span className={cn("mt-0.5 block text-[0.62rem] font-bold uppercase tracking-[0.22em]", tone === "light" ? "text-teal-300" : "text-teal-700")}>{rest.join(" ")}</span>
        )}
      </span>
    </span>
  );
}
