import type { ReactNode } from "react";

export type TimelineItem = {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  range: string;
  description?: string | null;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-8 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[31px] size-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-zinc-950"
          />
          <h3 className="text-lg font-semibold">{item.title}</h3>
          {item.subtitle ? (
            <p className="text-zinc-600 dark:text-zinc-400">{item.subtitle}</p>
          ) : null}
          <p className="text-sm text-zinc-500">{item.range}</p>
          {item.description ? (
            <p className="mt-2 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
