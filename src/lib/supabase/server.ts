import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/** Cookie-bound client acting as the signed-in user. Reads cookies, so it is request-time only. */
export async function createClient() {
  // Read cookies first so this is always treated as request-time work.
  const cookieStore = await cookies();
  const env = getSupabasePublicEnv();
  if (!env) throw new Error("Supabase is not configured (see .env.example).");

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component; the proxy refreshes sessions instead.
        }
      },
    },
  });
}
