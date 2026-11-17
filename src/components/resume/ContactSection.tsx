"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { submitContact } from "@/lib/actions/contact";
import { contactSchema, type ContactInput } from "@/lib/schemas/contact";
import { Section } from "./Section";

export function ContactSection() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    setStatus(null);
    const result = await submitContact(values);
    if (result.ok) {
      setStatus({ ok: true, message: "Thanks! Your message has been sent." });
      reset();
    } else {
      setStatus({ ok: false, message: result.error });
    }
  }

  return (
    <Section id="contact" title="Contact">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-xl space-y-4"
      >
        <Field id="contact-name" label="Name" error={errors.name?.message}>
          <Input
            id="contact-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />
        </Field>
        <Field
          id="contact-message"
          label="Message"
          error={errors.message?.message}
        >
          <Textarea
            id="contact-message"
            rows={6}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            {...register("message")}
          />
        </Field>
        {/* Honeypot: hidden from people and assistive tech, bots fill it in. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
          <StatusMessage status={status} />
        </div>
      </form>
    </Section>
  );
}
