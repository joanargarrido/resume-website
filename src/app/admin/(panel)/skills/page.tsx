import type { Metadata } from "next";
import { SkillsManager } from "@/components/admin/SkillsManager";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Skills</h1>
      <SkillsManager items={data ?? []} />
    </div>
  );
}
