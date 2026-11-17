import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { RESUME_TAG } from "@/lib/data/getResume";

export type ActionResult = { ok: true } | { ok: false; error: string };

export const ok: ActionResult = { ok: true };
export const fail = (error: string): ActionResult => ({ ok: false, error });

/** Runs an admin mutation: authenticates first, converts thrown errors to a result. */
export async function runAdminAction(
  fn: (ctx: Awaited<ReturnType<typeof requireAdmin>>) => Promise<ActionResult>,
): Promise<ActionResult> {
  try {
    const ctx = await requireAdmin();
    return await fn(ctx);
  } catch (error) {
    if (error instanceof UnauthorizedError)
      return fail("You must be signed in as admin.");
    console.error(error);
    return fail("Something went wrong. Please try again.");
  }
}

/** Makes saved content show up on the public page right away. */
export function revalidateResume() {
  updateTag(RESUME_TAG);
  revalidatePath("/");
  // Refresh admin screens that are already open.
  revalidatePath("/admin", "layout");
}
