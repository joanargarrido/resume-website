import type { Metadata } from "next";
import { ProfileForm, EMPTY_PROFILE } from "@/components/admin/ProfileForm";
import { saveProfile } from "@/lib/actions/profile";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const initial = data
    ? {
        full_name: data.full_name,
        date_of_birth: data.date_of_birth ?? "",
        dob_display: data.dob_display,
        city: data.city ?? "",
        headline: data.headline ?? "",
        bio: data.bio ?? "",
        linkedin_url: data.linkedin_url ?? "",
        github_url: data.github_url ?? "",
        email_public: data.email_public ?? "",
        photo_path: data.photo_path ?? "",
        cv_path: data.cv_path ?? "",
      }
    : EMPTY_PROFILE;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <ProfileForm initial={initial} onSubmit={saveProfile} />
    </div>
  );
}
