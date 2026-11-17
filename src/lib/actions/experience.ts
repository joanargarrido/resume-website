"use server";

import { moveItem, nextSortOrder } from "./crud";
import { emptyToNull } from "@/lib/schemas/common";
import {
  experienceSchema,
  type ExperienceInput,
} from "@/lib/schemas/experience";
import {
  fail,
  ok,
  revalidateResume,
  runAdminAction,
  type ActionResult,
} from "./result";

export async function createExperience(
  input: ExperienceInput,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = experienceSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const sort_order = await nextSortOrder(supabase, "experience", "top");
    const { error } = await supabase
      .from("experience")
      .insert({ ...emptyToNull(parsed.data), sort_order } as never);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function updateExperience(
  id: string,
  input: ExperienceInput,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = experienceSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const { error } = await supabase
      .from("experience")
      .update(emptyToNull(parsed.data) as never)
      .eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function moveExperience(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    await moveItem(supabase, "experience", id, direction);
    revalidateResume();
    return ok;
  });
}
