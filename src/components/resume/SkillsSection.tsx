import { Badge } from "@/components/ui/Badge";
import type { Skill } from "@/types/domain";
import { Section } from "./Section";

const UNCATEGORISED = "Other";

export function SkillsSection({ items }: { items: Skill[] }) {
  if (items.length === 0) return null;

  const groups = new Map<string, Skill[]>();
  for (const skill of items) {
    const key = skill.category?.trim() || UNCATEGORISED;
    groups.set(key, [...(groups.get(key) ?? []), skill]);
  }
  // Keep "Other" last, otherwise preserve admin order.
  const entries = [...groups.entries()].sort(
    ([a], [b]) => Number(a === UNCATEGORISED) - Number(b === UNCATEGORISED),
  );

  return (
    <Section id="skills" title="Skills">
      <div className="space-y-5">
        {entries.map(([category, skills]) => (
          <div key={category}>
            {entries.length > 1 || category !== UNCATEGORISED ? (
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
                {category}
              </h3>
            ) : null}
            <ul className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s.id}>
                  <Badge title={s.level ? `Level ${s.level} of 5` : undefined}>
                    {s.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
