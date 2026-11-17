"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ActionResult } from "@/lib/actions/result";
import { profileSchema, type ProfileInput } from "@/lib/schemas/profile";
import { ImageUpload } from "./ImageUpload";
import { PdfUpload } from "./PdfUpload";

export const EMPTY_PROFILE: ProfileInput = {
  full_name: "",
  date_of_birth: "",
  dob_display: "hidden",
  city: "",
  headline: "",
  bio: "",
  linkedin_url: "",
  github_url: "",
  email_public: "",
  photo_path: "",
  cv_path: "",
};

export function ProfileForm({
  initial = EMPTY_PROFILE,
  onSubmit,
}: {
  initial?: ProfileInput;
  onSubmit: (values: ProfileInput) => Promise<ActionResult>;
}) {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  });

  async function submit(values: ProfileInput) {
    setStatus(null);
    const result = await onSubmit(values);
    setStatus(
      result.ok
        ? { ok: true, message: "Profile saved." }
        : { ok: false, message: result.error },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="max-w-2xl space-y-5"
    >
      <Field id="full_name" label="Full name" error={errors.full_name?.message}>
        <Input id="full_name" {...register("full_name")} />
      </Field>
      <Field id="headline" label="Headline" error={errors.headline?.message}>
        <Input id="headline" {...register("headline")} />
      </Field>
      <Field id="city" label="City" error={errors.city?.message}>
        <Input id="city" {...register("city")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="date_of_birth"
          label="Date of birth"
          error={errors.date_of_birth?.message}
        >
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth")}
          />
        </Field>
        <Field id="dob_display" label="Show date of birth as">
          <Select id="dob_display" {...register("dob_display")}>
            <option value="hidden">Hidden</option>
            <option value="age">Age only</option>
            <option value="month_year">Month and year</option>
            <option value="full">Full date</option>
          </Select>
        </Field>
      </div>
      <Field id="bio" label="Bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={6} {...register("bio")} />
      </Field>
      <Field
        id="linkedin_url"
        label="LinkedIn URL"
        error={errors.linkedin_url?.message}
      >
        <Input id="linkedin_url" type="url" {...register("linkedin_url")} />
      </Field>
      <Field
        id="github_url"
        label="GitHub URL"
        error={errors.github_url?.message}
      >
        <Input id="github_url" type="url" {...register("github_url")} />
      </Field>
      <Field
        id="email_public"
        label="Public email (optional)"
        error={errors.email_public?.message}
      >
        <Input id="email_public" type="email" {...register("email_public")} />
      </Field>
      <Controller
        control={control}
        name="photo_path"
        render={({ field }) => (
          <ImageUpload value={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="cv_path"
        render={({ field }) => (
          <PdfUpload value={field.value} onChange={field.onChange} />
        )}
      />
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save profile"}
        </Button>
        <StatusMessage status={status} />
      </div>
    </form>
  );
}
