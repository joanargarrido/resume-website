"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ActionResult } from "@/lib/actions/result";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/schemas/experience";

export const EMPTY_EXPERIENCE: ExperienceInput = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  company_url: "",
};

export function ExperienceForm({
  initial = EMPTY_EXPERIENCE,
  onSubmit,
  onCancel,
}: {
  initial?: ExperienceInput;
  onSubmit: (values: ExperienceInput) => Promise<ActionResult>;
  onCancel?: () => void;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initial,
  });

  async function submit(values: ExperienceInput) {
    setStatus(null);
    const result = await onSubmit(values);
    if (!result.ok) setStatus({ ok: false, message: result.error });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="company" label="Company" error={errors.company?.message}>
          <Input id="company" {...register("company")} />
        </Field>
        <Field id="role" label="Role" error={errors.role?.message}>
          <Input id="role" {...register("role")} />
        </Field>
        <Field id="location" label="Location" error={errors.location?.message}>
          <Input id="location" {...register("location")} />
        </Field>
        <Field
          id="company_url"
          label="Company website"
          error={errors.company_url?.message}
        >
          <Input id="company_url" type="url" {...register("company_url")} />
        </Field>
        <Field
          id="start_date"
          label="Start date"
          error={errors.start_date?.message}
        >
          <Input id="start_date" type="date" {...register("start_date")} />
        </Field>
        <Field
          id="end_date"
          label="End date"
          hint="Leave empty if this is your current job"
          error={errors.end_date?.message}
        >
          <Input id="end_date" type="date" {...register("end_date")} />
        </Field>
      </div>
      <Field
        id="description"
        label="Description"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={4} {...register("description")} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <StatusMessage status={status} />
      </div>
    </form>
  );
}
