import { forwardRef } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { FieldError, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Field({ id, label, error, children, className, required = true }: { id: string; label: string; error?: string; children: React.ReactNode; className?: string; required?: boolean }) {
  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-600" aria-hidden> *</span>}
      </Label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** a11y props for an input bound to a Field */
export const aria = (id: string, error?: string) => ({ id, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-error` : undefined });

/** Off-screen honeypot. Real users never see or fill it. */
export const Honeypot = forwardRef<HTMLInputElement>(function Honeypot(_, ref) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input ref={ref} type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
});

export function PrivacyNote({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-xs", tone === "light" ? "text-navy-200" : "text-ink-subtle")}>
      <Lock className="h-3.5 w-3.5" aria-hidden /> We respect your privacy. Your information is secure.
    </p>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200">
      {message}
    </p>
  );
}

export function SuccessMessage({ title = "Thank you.", message = "Our business development team will contact you shortly.", onReset }: { title?: string; message?: string; onReset?: () => void }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center px-4 py-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-600 ring-8 ring-teal-50/50">
        <CheckCircle2 className="h-7 w-7" aria-hidden />
      </span>
      <h3 className="mt-5 text-xl font-bold text-navy-950">{title}</h3>
      <p className="mt-2 max-w-sm text-ink-muted">{message}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-5 text-sm font-semibold text-brand-600 hover:underline">
          Submit another enquiry
        </button>
      )}
    </div>
  );
}
