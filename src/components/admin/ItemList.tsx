"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { ActionResult } from "@/lib/actions/result";

export type ListEntry = { id: string; title: string; subtitle?: string };

/** Presentational list with edit, delete (with confirmation) and up/down reorder. */
export function ItemList({
  entries,
  onEdit,
  onDelete,
  onMove,
  disabled = false,
}: {
  entries: ListEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  disabled?: boolean;
}) {
  if (entries.length === 0)
    return <p className="text-zinc-500">Nothing here yet.</p>;

  return (
    <ul className="space-y-3">
      {entries.map((entry, index) => (
        <li key={entry.id}>
          <Card className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{entry.title}</p>
              {entry.subtitle ? (
                <p className="text-sm text-zinc-500">{entry.subtitle}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                aria-label={`Move ${entry.title} up`}
                disabled={disabled || index === 0}
                onClick={() => onMove(entry.id, "up")}
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                aria-label={`Move ${entry.title} down`}
                disabled={disabled || index === entries.length - 1}
                onClick={() => onMove(entry.id, "down")}
              >
                ↓
              </Button>
              <Button
                variant="secondary"
                aria-label={`Edit ${entry.title}`}
                disabled={disabled}
                onClick={() => onEdit(entry.id)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                aria-label={`Delete ${entry.title}`}
                disabled={disabled}
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${entry.title}"? This cannot be undone.`,
                    )
                  ) {
                    onDelete(entry.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** Wires an ItemList and a form together around a set of server actions. */
export function ResourceManager<T extends { id: string }>({
  noun,
  items,
  describe,
  renderForm,
  onDelete,
  onMove,
}: {
  noun: string;
  items: T[];
  describe: (item: T) => ListEntry;
  /** `done` closes the form and refreshes the page. */
  renderForm: (args: {
    item: T | null;
    done: () => void;
    cancel: () => void;
  }) => ReactNode;
  onDelete: (id: string) => Promise<ActionResult>;
  onMove: (id: string, direction: "up" | "down") => Promise<ActionResult>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function run(action: () => Promise<ActionResult>) {
    setBusy(true);
    setStatus(null);
    const result = await action();
    setBusy(false);
    if (result.ok) router.refresh();
    else setStatus({ ok: false, message: result.error });
  }

  const done = () => {
    setEditing(null);
    router.refresh();
  };
  const item =
    editing && editing !== "new"
      ? (items.find((i) => i.id === editing) ?? null)
      : null;

  return (
    <div className="space-y-6">
      {editing ? (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">
            {editing === "new" ? `Add ${noun}` : `Edit ${noun}`}
          </h2>
          {renderForm({ item, done, cancel: () => setEditing(null) })}
        </Card>
      ) : (
        <Button onClick={() => setEditing("new")}>Add {noun}</Button>
      )}
      <StatusMessage status={status} />
      <ItemList
        entries={items.map(describe)}
        disabled={busy}
        onEdit={setEditing}
        onDelete={(id) => run(() => onDelete(id))}
        onMove={(id, dir) => run(() => onMove(id, dir))}
      />
    </div>
  );
}
