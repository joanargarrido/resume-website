import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/** Browser client, used for direct (RLS-protected) storage uploads from the admin area. */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
