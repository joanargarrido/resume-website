import { formatDateRange } from "@/lib/format/formatDateRange";
import type { Education } from "@/types/domain";
import { Section } from "./Section";
import { Timeline } from "./Timeline";

export function EducationSection({ items }: { items: Education[] }) {
  if (items.length === 0) return null;
  return (
    <Section id="education" title="Education">
      <Timeline
        items={items.map((e) => ({
          id: e.id,
          title: [e.degree, e.field].filter(Boolean).join(", "),
          subtitle: e.institution,
          range: formatDateRange(e.start_date, e.end_date),
          description: e.description,
        }))}
      />
    </Section>
  );
}
