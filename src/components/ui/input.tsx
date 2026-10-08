import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full rounded-xl border border-line bg-white px-3.5 text-[0.95rem] text-ink placeholder:text-ink-subtle shadow-[inset_0_1px_1px_rgba(13,30,63,0.03)] transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-60 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldBase, "h-11", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldBase, "min-h-[120px] py-3", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      fieldBase,
      "select-chevron h-11 appearance-none pr-10",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-semibold text-navy-900", className)} {...props} />;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[0.8rem] font-medium text-red-600">
      {message}
    </p>
  );
}
