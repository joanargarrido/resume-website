import type { Metadata } from "next";
import { ExperienceManager } from "@/components/admin/ExperienceManager";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Experience</h1>
      <ExperienceManager items={data ?? []} />
    </div>
  );
}
