import type { Metadata } from "next";
import { EducationManager } from "@/components/admin/EducationManager";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Education" };

export default async function EducationPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("education")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Education</h1>
      <EducationManager items={data ?? []} />
    </div>
  );
}
