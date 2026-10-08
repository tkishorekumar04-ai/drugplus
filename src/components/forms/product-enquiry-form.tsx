"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { productEnquirySchema } from "@/lib/validation";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, aria, Honeypot, PrivacyNote, FormError, SuccessMessage } from "./fields";
import { Turnstile } from "./turnstile";
import { useLeadSubmit } from "./use-lead-submit";

type In = z.input<typeof productEnquirySchema>;
type Out = z.output<typeof productEnquirySchema>;

export function ProductEnquiryForm({ productId, productName }: { productId: string; productName: string }) {
  const { status, error, submit, onFocusCapture, onToken, resetSignal, honeypot } = useLeadSubmit("product", "product-page");
  const { register, handleSubmit, formState: { errors } } = useForm<In, unknown, Out>({
    resolver: zodResolver(productEnquirySchema),
    defaultValues: { productId, productName, message: `I would like business details for ${productName}.` },
  });

  if (status === "success") return <SuccessMessage message="Our team will share product and business details shortly." />;

  return (
    <form noValidate onFocusCapture={onFocusCapture} onSubmit={handleSubmit(async (d) => { await submit(d); })} className="relative">
      <Honeypot ref={honeypot} />
      <input type="hidden" {...register("productId")} />
      <div className="grid gap-3.5">
        <Field id="pe-name" label="Name" error={errors.name?.message}>
          <Input {...aria("pe-name", errors.name?.message)} autoComplete="name" {...register("name")} />
        </Field>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field id="pe-phone" label="Mobile" error={errors.phone?.message}>
            <Input {...aria("pe-phone", errors.phone?.message)} type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />
          </Field>
          <Field id="pe-city" label="City" error={errors.city?.message}>
            <Input {...aria("pe-city", errors.city?.message)} autoComplete="address-level2" {...register("city")} />
          </Field>
        </div>
        <Field id="pe-email" label="Email" error={errors.email?.message} required={false}>
          <Input {...aria("pe-email", errors.email?.message)} type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field id="pe-message" label="Message" error={errors.message?.message} required={false}>
          <Textarea {...aria("pe-message", errors.message?.message)} rows={3} className="min-h-[88px]" {...register("message")} />
        </Field>
      </div>
      <div className="mt-4 space-y-3">
        <Turnstile onToken={onToken} resetSignal={resetSignal} />
        <FormError message={error} />
        <Button type="submit" className="w-full" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden /> Sending…</> : <>Enquire About This Product <ArrowRight aria-hidden /></>}
        </Button>
        <PrivacyNote />
      </div>
    </form>
  );
}
