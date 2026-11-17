"use server";

import { profileSchema, type ProfileInput } from "@/lib/schemas/profile";
import { emptyToNull } from "@/lib/schemas/common";
import {
  fail,
  ok,
  revalidateResume,
  runAdminAction,
  type ActionResult,
} from "./result";

export async function saveProfile(input: ProfileInput): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success)
      return fail(parsed.error.issues[0]?.message ?? "Invalid data");

    const { error } = await supabase
      .from("profile")
      .upsert({ id: 1, ...emptyToNull(parsed.data) } as never);
    if (error) throw error;

    revalidateResume();
    return ok;
  });
}
