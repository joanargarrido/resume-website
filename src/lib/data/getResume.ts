import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { Resume } from "@/types/domain";

export const RESUME_TAG = "resume";

/**
 * Everything the public page needs, in one cached bundle. Admin saves call
 * `updateTag(RESUME_TAG)` so edits show up immediately.
 */
export async function getResume(): Promise<Resume> {
  "use cache";
  cacheTag(RESUME_TAG);
  cacheLife("max");

  const supabase = createPublicClient();
  if (!supabase)
    return { profile: null, education: [], experience: [], skills: [] };

  const [profile, education, experience, skills] = await Promise.all([
    supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
    supabase.from("education").select("*").order("sort_order"),
    supabase.from("experience").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
  ]);

  const error =
    profile.error ?? education.error ?? experience.error ?? skills.error;
  if (error) throw new Error(`Failed to load resume: ${error.message}`);

  return {
    profile: profile.data,
    education: education.data ?? [],
    experience: experience.data ?? [],
    skills: skills.data ?? [],
  };
}
