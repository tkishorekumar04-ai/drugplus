"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { quickLeadSchema } from "@/lib/validation";
import { BUSINESS_TYPES, INTEREST_OPTIONS } from "@/lib/constants";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, aria, Honeypot, PrivacyNote, FormError, SuccessMessage } from "./fields";
import { Turnstile } from "./turnstile";
import { useLeadSubmit } from "./use-lead-submit";

type In = z.input<typeof quickLeadSchema>;
type Out = z.output<typeof quickLeadSchema>;

export function QuickLeadForm({ source = "hero-form", defaultInterest, title = "Request Business Details", subtitle }: { source?: string; defaultInterest?: In["interestedIn"]; title?: string; subtitle?: string }) {
  const { status, error, submit, onFocusCapture, onToken, resetSignal, honeypot, reset } = useLeadSubmit("quick", source);
  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<In, unknown, Out>({
    resolver: zodResolver(quickLeadSchema),
    defaultValues: { interestedIn: defaultInterest ?? "FRANCHISE", businessType: "" },
  });
  const id = (n: string) => `${source}-${n}`;

  if (status === "success") return <SuccessMessage onReset={() => { resetForm(); reset(); }} />;

  return (
    <form noValidate onFocusCapture={onFocusCapture} onSubmit={handleSubmit(async (d) => { await submit(d); })} className="relative" aria-labelledby={id("title")}>
      <h2 id={id("title")} className="text-xl font-bold tracking-tight text-navy-950">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{subtitle ?? "Get franchise details, product list & pricing within one business day."}</p>
      <Honeypot ref={honeypot} />
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
        <Field id={id("name")} label="Full Name" error={errors.name?.message} className="sm:col-span-2">
          <Input {...aria(id("name"), errors.name?.message)} autoComplete="name" placeholder="Your full name" {...register("name")} />
        </Field>
        <Field id={id("phone")} label="Mobile Number" error={errors.phone?.message}>
          <Input {...aria(id("phone"), errors.phone?.message)} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" {...register("phone")} />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email?.message}>
          <Input {...aria(id("email"), errors.email?.message)} type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field id={id("location")} label="City / State" error={errors.location?.message} className="sm:col-span-2">
          <Input {...aria(id("location"), errors.location?.message)} autoComplete="address-level2" placeholder="e.g. Hyderabad, Telangana" {...register("location")} />
        </Field>
        <Field id={id("businessType")} label="Business Type" error={errors.businessType?.message}>
          <Select {...aria(id("businessType"), errors.businessType?.message)} {...register("businessType")}>
            <option value="" disabled>Select…</option>
            {BUSINESS_TYPES.map((b) => <option key={b}>{b}</option>)}
          </Select>
        </Field>
        <Field id={id("interestedIn")} label="Interested In" error={errors.interestedIn?.message}>
          <Select {...aria(id("interestedIn"), errors.interestedIn?.message)} {...register("interestedIn")}>
            {INTEREST_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>
      <div className="mt-4 space-y-3">
        <Turnstile onToken={onToken} resetSignal={resetSignal} />
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden /> Sending…</> : <>Request Business Details <ArrowRight aria-hidden /></>}
        </Button>
        <PrivacyNote />
      </div>
    </form>
  );
}
