"use server";

import { moveItem, nextSortOrder } from "./crud";
import { emptyToNull } from "@/lib/schemas/common";
import { educationSchema, type EducationInput } from "@/lib/schemas/education";
import {
  fail,
  ok,
  revalidateResume,
  runAdminAction,
  type ActionResult,
} from "./result";

export async function createEducation(
  input: EducationInput,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = educationSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const sort_order = await nextSortOrder(supabase, "education", "top");
    const { error } = await supabase
      .from("education")
      .insert({ ...emptyToNull(parsed.data), sort_order } as never);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function updateEducation(
  id: string,
  input: EducationInput,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = educationSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const { error } = await supabase
      .from("education")
      .update(emptyToNull(parsed.data) as never)
      .eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function moveEducation(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    await moveItem(supabase, "education", id, direction);
    revalidateResume();
    return ok;
  });
}
