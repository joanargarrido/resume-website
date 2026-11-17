"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ActionResult } from "@/lib/actions/result";
import { educationSchema, type EducationInput } from "@/lib/schemas/education";

export const EMPTY_EDUCATION: EducationInput = {
  institution: "",
  degree: "",
  field: "",
  start_date: "",
  end_date: "",
  description: "",
};

export function EducationForm({
  initial = EMPTY_EDUCATION,
  onSubmit,
  onCancel,
}: {
  initial?: EducationInput;
  onSubmit: (values: EducationInput) => Promise<ActionResult>;
  onCancel?: () => void;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: initial,
  });

  async function submit(values: EducationInput) {
    setStatus(null);
    const result = await onSubmit(values);
    if (!result.ok) setStatus({ ok: false, message: result.error });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <Field
        id="institution"
        label="Institution"
        error={errors.institution?.message}
      >
        <Input id="institution" {...register("institution")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="degree" label="Degree" error={errors.degree?.message}>
          <Input id="degree" {...register("degree")} />
        </Field>
        <Field id="field" label="Field of study" error={errors.field?.message}>
          <Input id="field" {...register("field")} />
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
          hint="Leave empty if ongoing"
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
        <Textarea id="description" rows={3} {...register("description")} />
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
