"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { contactSchema } from "@/lib/validation";
import { CONTACT_ENQUIRY_TYPES } from "@/lib/constants";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, aria, Honeypot, PrivacyNote, FormError, SuccessMessage } from "./fields";
import { Turnstile } from "./turnstile";
import { useLeadSubmit } from "./use-lead-submit";

type In = z.input<typeof contactSchema>;
type Out = z.output<typeof contactSchema>;

export function ContactForm({ source = "contact-page", defaultType }: { source?: string; defaultType?: (typeof CONTACT_ENQUIRY_TYPES)[number] }) {
  const { status, error, submit, onFocusCapture, onToken, resetSignal, honeypot, reset } = useLeadSubmit("contact", source);
  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<In, unknown, Out>({
    resolver: zodResolver(contactSchema),
    defaultValues: { enquiryType: defaultType ?? ("" as In["enquiryType"]) },
  });
  const id = (n: string) => `${source}-${n}`;

  if (status === "success") return <SuccessMessage title="Thank you for reaching out." message="Our team will get back to you shortly." onReset={() => { resetForm(); reset(); }} />;

  return (
    <form noValidate onFocusCapture={onFocusCapture} onSubmit={handleSubmit(async (d) => { await submit(d); })} className="relative">
      <Honeypot ref={honeypot} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={id("name")} label="Name" error={errors.name?.message}>
          <Input {...aria(id("name"), errors.name?.message)} autoComplete="name" {...register("name")} />
        </Field>
        <Field id={id("phone")} label="Phone" error={errors.phone?.message}>
          <Input {...aria(id("phone"), errors.phone?.message)} type="tel" inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field id={id("email")} label="Email" error={errors.email?.message}>
          <Input {...aria(id("email"), errors.email?.message)} type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field id={id("type")} label="Enquiry Type" error={errors.enquiryType?.message}>
          <Select {...aria(id("type"), errors.enquiryType?.message)} {...register("enquiryType")}>
            <option value="" disabled>Select…</option>
            {CONTACT_ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field id={id("message")} label="Message" error={errors.message?.message} className="sm:col-span-2">
          <Textarea {...aria(id("message"), errors.message?.message)} rows={5} placeholder="How can we help?" {...register("message")} />
        </Field>
      </div>
      <div className="mt-5 space-y-3">
        <Turnstile onToken={onToken} resetSignal={resetSignal} />
        <FormError message={error} />
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting" ? <><Loader2 className="animate-spin" aria-hidden /> Sending…</> : <>Send Enquiry <Send aria-hidden /></>}
        </Button>
        <PrivacyNote />
      </div>
    </form>
  );
}
