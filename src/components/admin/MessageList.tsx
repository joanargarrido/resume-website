"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { deleteMessage, setMessageRead } from "@/lib/actions/messages";
import type { ActionResult } from "@/lib/actions/result";
import type { ContactMessage } from "@/types/domain";

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  async function run(action: () => Promise<ActionResult>) {
    const result = await action();
    if (result.ok) router.refresh();
    else setStatus({ ok: false, message: result.error });
  }

  if (messages.length === 0)
    return <p className="text-zinc-500">No messages yet.</p>;

  return (
    <div className="space-y-3">
      <StatusMessage status={status} />
      <ul className="space-y-3">
        {messages.map((m) => (
          <li key={m.id}>
            <Card
              className={
                m.read ? "" : "border-indigo-400 dark:border-indigo-500"
              }
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {m.name}{" "}
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm font-normal underline"
                  >
                    {m.email}
                  </a>
                </p>
                <time dateTime={m.created_at} className="text-sm text-zinc-500">
                  {new Date(m.created_at).toLocaleString("en-GB")}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => run(() => setMessageRead(m.id, !m.read))}
                >
                  {m.read ? "Mark as unread" : "Mark as read"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm("Delete this message?"))
                      run(() => deleteMessage(m.id));
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
