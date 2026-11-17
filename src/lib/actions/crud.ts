import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type OrderedTable = "education" | "experience" | "skills";
type Client = SupabaseClient<Database>;

/** New experience/education goes on top (newest first); new skills go to the end. */
export async function nextSortOrder(
  supabase: Client,
  table: OrderedTable,
  position: "top" | "bottom",
): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: position === "top" })
    .limit(1);
  if (error) throw error;
  const current = data?.[0]?.sort_order;
  if (current === undefined) return 0;
  return position === "top" ? current - 1 : current + 1;
}

/** Swaps an item with its neighbour and rewrites sort_order as a clean 0..n sequence. */
export async function moveItem(
  supabase: Client,
  table: OrderedTable,
  id: string,
  direction: "up" | "down",
): Promise<void> {
  const { data, error } = await supabase
    .from(table)
    .select("id, sort_order")
    .order("sort_order")
    .order("id");
  if (error) throw error;
  const rows = data ?? [];
  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= rows.length) return;

  [rows[index], rows[target]] = [rows[target], rows[index]];
  for (const [position, row] of rows.entries()) {
    if (row.sort_order === position) continue;
    const { error: updateError } = await supabase
      .from(table)
      .update({ sort_order: position })
      .eq("id", row.id);
    if (updateError) throw updateError;
  }
}
