import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:translate-y-px [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-600 text-white shadow-[0_8px_24px_-10px_rgba(26,79,214,0.7)] hover:bg-brand-700",
        secondary: "bg-teal-600 text-white hover:bg-teal-700 shadow-[0_8px_24px_-10px_rgba(13,125,109,0.7)]",
        navy: "bg-navy-900 text-white hover:bg-navy-800",
        outline: "border border-line bg-white text-navy-900 hover:border-navy-300 hover:bg-navy-50",
        ghostLight: "border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15",
        white: "bg-white text-navy-900 hover:bg-navy-50",
        whatsapp: "bg-[#147A3E] text-white hover:bg-[#10632F]",
        link: "rounded-none px-0 text-brand-600 underline-offset-4 hover:underline",
        ghost: "text-navy-800 hover:bg-navy-50",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-[3.25rem] px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & Variants;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = "Button";

type LinkButtonProps = React.ComponentProps<typeof Link> & Variants;

export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
