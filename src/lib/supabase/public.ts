import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/** Anonymous, cookie-free client. Safe to use inside `use cache` scopes. */
export function createPublicClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createClient<Database>(env.url, env.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
