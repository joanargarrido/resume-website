import { createClient } from "@/lib/supabase/server";

/**
 * Returns the Supabase client and user when the caller is a signed-in admin.
 * Throws otherwise. Call this at the top of every admin Server Action.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new UnauthorizedError();

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || !isAdmin) throw new UnauthorizedError();

  return { supabase, user: data.user };
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}
