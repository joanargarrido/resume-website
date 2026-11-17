import type { Metadata } from "next";
import { MessageList } from "@/components/admin/MessageList";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      <MessageList messages={data ?? []} />
    </div>
  );
}
