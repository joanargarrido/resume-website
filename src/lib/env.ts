/** Returns the public Supabase settings, or null when the project is not configured yet. */
export function getSupabasePublicEnv(): {
  url: string;
  anonKey: string;
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

/** Public URL of a file in the `public-assets` storage bucket. */
export function publicAssetUrl(path: string | null | undefined): string | null {
  const env = getSupabasePublicEnv();
  if (!path || !env) return null;
  return `${env.url.replace(/\/$/, "")}/storage/v1/object/public/public-assets/${path}`;
}
