"use server";

import { moveItem, nextSortOrder } from "./crud";
import { skillSchema, type SkillInput } from "@/lib/schemas/skill";
import {
  fail,
  ok,
  revalidateResume,
  runAdminAction,
  type ActionResult,
} from "./result";

function toRow(input: SkillInput) {
  return {
    name: input.name,
    category: input.category === "" ? null : input.category,
    level: input.level === "" ? null : Number(input.level),
  };
}

export async function createSkill(input: SkillInput): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const sort_order = await nextSortOrder(supabase, "skills", "bottom");
    const { error } = await supabase
      .from("skills")
      .insert({ ...toRow(parsed.data), sort_order });
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function updateSkill(
  id: string,
  input: SkillInput,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = skillSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const { error } = await supabase
      .from("skills")
      .update(toRow(parsed.data))
      .eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}

export async function moveSkill(
  id: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    await moveItem(supabase, "skills", id, direction);
    revalidateResume();
    return ok;
  });
}
