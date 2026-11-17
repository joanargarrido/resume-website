import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false);

  const links = [
    ["/admin/profile", "Edit profile, photo and CV"],
    ["/admin/experience", "Manage work experience"],
    ["/admin/education", "Manage education"],
    ["/admin/skills", "Manage skills"],
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <p className="text-3xl font-bold">{count ?? 0}</p>
        <p className="text-zinc-500">
          unread {count === 1 ? "message" : "messages"} ·{" "}
          <Link href="/admin/messages" className="underline">
            open inbox
          </Link>
        </p>
      </Card>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-xl border border-zinc-200 p-4 hover:border-indigo-400 dark:border-zinc-800"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
