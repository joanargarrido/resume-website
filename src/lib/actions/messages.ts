"use server";

import { revalidatePath } from "next/cache";
import { ok, runAdminAction, type ActionResult } from "./result";

export async function setMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return ok;
  });
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  return runAdminAction(async ({ supabase }) => {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return ok;
  });
}
