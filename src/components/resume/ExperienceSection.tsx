import { formatDateRange } from "@/lib/format/formatDateRange";
import type { Experience } from "@/types/domain";
import { Section } from "./Section";
import { Timeline } from "./Timeline";

export function ExperienceSection({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="experience" title="Experience">
      <Timeline
        items={items.map((e) => ({
          id: e.id,
          title: e.role,
          subtitle: (
            <>
              {e.company_url ? (
                <a
                  href={e.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-zinc-400 underline-offset-2 hover:text-indigo-600"
                >
                  {e.company}
                </a>
              ) : (
                e.company
              )}
              {e.location ? ` · ${e.location}` : ""}
            </>
          ),
          range: formatDateRange(e.start_date, e.end_date),
          description: e.description,
        }))}
      />
    </Section>
  );
}
