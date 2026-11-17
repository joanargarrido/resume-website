"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ActionResult } from "@/lib/actions/result";
import { skillSchema, type SkillInput } from "@/lib/schemas/skill";

export const EMPTY_SKILL: SkillInput = { name: "", category: "", level: "" };

export function SkillForm({
  initial = EMPTY_SKILL,
  onSubmit,
  onCancel,
}: {
  initial?: SkillInput;
  onSubmit: (values: SkillInput) => Promise<ActionResult>;
  onCancel?: () => void;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: initial,
  });

  async function submit(values: SkillInput) {
    setStatus(null);
    const result = await onSubmit(values);
    if (!result.ok) setStatus({ ok: false, message: result.error });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input id="name" {...register("name")} />
        </Field>
        <Field id="category" label="Category" error={errors.category?.message}>
          <Input
            id="category"
            placeholder="e.g. Frontend"
            {...register("category")}
          />
        </Field>
        <Field id="level" label="Level">
          <Select id="level" {...register("level")}>
            <option value="">Not set</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
      </div>
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
