import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-navy-50 text-navy-700 ring-1 ring-inset ring-navy-100",
      teal: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100",
      brand: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100",
      dark: "bg-white/10 text-white ring-1 ring-inset ring-white/20",
      warn: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
      danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
      success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
