"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { franchiseSchema } from "@/lib/validation";
import { EXPERIENCE_OPTIONS, INDIAN_STATES, INVESTMENT_OPTIONS } from "@/lib/constants";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, aria, Honeypot, PrivacyNote, FormError, SuccessMessage } from "./fields";
import { Turnstile } from "./turnstile";
import { useLeadSubmit } from "./use-lead-submit";

type In = z.input<typeof franchiseSchema>;
type Out = z.output<typeof franchiseSchema>;

export function FranchiseForm({ segments, source = "franchise-page", defaultState, defaultTerritory }: { segments: string[]; source?: string; defaultState?: string; defaultTerritory?: string }) {
  const { status, error, submit, onFocusCapture, onToken, resetSignal, honeypot, reset } = useLeadSubmit("franchise", source);
  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<In, unknown, Out>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: { franchiseType: "FRANCHISE", state: defaultState ?? "", preferredTerritory: defaultTerritory ?? "", businessExperience: "", investmentRange: "", productSegment: "" },
  });
  const id = (n: string) => `${source}-${n}`;

  if (status === "success") {
    return <SuccessMessage title="Thank you." message="Our business development team will contact you shortly." onReset={() => { resetForm(); reset(); }} />;
  }

  return (
    <form noValidate onFocusCapture={onFocusCapture} onSubmit={handleSubmit(async (d) => { await submit(d); })} className="relative">
      <Honeypot ref={honeypot} />
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-semibold text-navy-900">Franchise type</legend>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface p-1.5 ring-1 ring-inset ring-line">
          {[
            { v: "FRANCHISE", l: "PCD Franchise" },
            { v: "MONOPOLY", l: "Monopoly Rights" },
          ].map((o) => (
            <label key={o.v} className="cursor-pointer">
              <input type="radio" value={o.v} className="peer sr-only" {...register("franchiseType")} />
              <span className="block rounded-xl px-3 py-2.5 text-center text-sm font-semibold text-ink-muted transition peer-checked:bg-white peer-checked:text-navy-950 peer-checked:shadow-card peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500">
                {o.l}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id("name")} label="Name" error={errors.name?.message}>
          <Input {...aria(id("name"), errors.name?.message)} autoComplete="name" placeholder="Your full name" {...register("name")} />
        </Field>
        <Field id={id("phone")} label="Mobile" error={errors.phone?.message}>
          <Input {...aria(id("phone"), errors.phone?.message)} type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" {...register("phone")} />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email?.message} className="sm:col-span-2">
          <Input {...aria(id("email"), errors.email?.message)} type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
        </Field>
        <Field id={id("state")} label="State" error={errors.state?.message}>
          <Select {...aria(id("state"), errors.state?.message)} autoComplete="address-level1" {...register("state")}>
            <option value="" disabled>Select state…</option>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field id={id("city")} label="City" error={errors.city?.message}>
          <Input {...aria(id("city"), errors.city?.message)} autoComplete="address-level2" placeholder="Your city" {...register("city")} />
        </Field>
        <Field id={id("territory")} label="Preferred Territory" error={errors.preferredTerritory?.message} className="sm:col-span-2">
          <Input {...aria(id("territory"), errors.preferredTerritory?.message)} placeholder="District / town(s) you want to cover" {...register("preferredTerritory")} />
        </Field>
        <Field id={id("experience")} label="Business Experience" error={errors.businessExperience?.message}>
          <Select {...aria(id("experience"), errors.businessExperience?.message)} {...register("businessExperience")}>
            <option value="" disabled>Select…</option>
            {EXPERIENCE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field id={id("investment")} label="Investment Range" error={errors.investmentRange?.message}>
          <Select {...aria(id("investment"), errors.investmentRange?.message)} {...register("investmentRange")}>
            <option value="" disabled>Select…</option>
            {INVESTMENT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field id={id("segment")} label="Interested Product Segment" error={errors.productSegment?.message} className="sm:col-span-2">
          <Select {...aria(id("segment"), errors.productSegment?.message)} {...register("productSegment")}>
            <option value="" disabled>Select a segment…</option>
            <option>Complete Range (multi-specialty)</option>
            {segments.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
      </div>
      <div className="mt-5 space-y-3">
        <Turnstile onToken={onToken} resetSignal={resetSignal} />
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden /> Submitting…</> : <>Apply Now <ArrowRight aria-hidden /></>}
        </Button>
        <PrivacyNote />
      </div>
    </form>
  );
}
