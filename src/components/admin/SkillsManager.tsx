"use client";

import {
  createSkill,
  deleteSkill,
  moveSkill,
  updateSkill,
} from "@/lib/actions/skills";
import type { Skill } from "@/types/domain";
import { ResourceManager } from "./ItemList";
import { SkillForm } from "./SkillForm";

export function SkillsManager({ items }: { items: Skill[] }) {
  return (
    <ResourceManager
      noun="skill"
      items={items}
      describe={(s) => ({
        id: s.id,
        title: s.name,
        subtitle: [s.category, s.level ? `Level ${s.level}/5` : null]
          .filter(Boolean)
          .join(" · "),
      })}
      onDelete={deleteSkill}
      onMove={moveSkill}
      renderForm={({ item, done, cancel }) => (
        <SkillForm
          key={item?.id ?? "new"}
          initial={
            item
              ? {
                  name: item.name,
                  category: item.category ?? "",
                  level: item.level
                    ? (String(item.level) as "1" | "2" | "3" | "4" | "5")
                    : "",
                }
              : undefined
          }
          onCancel={cancel}
          onSubmit={async (values) => {
            const result = item
              ? await updateSkill(item.id, values)
              : await createSkill(values);
            if (result.ok) done();
            return result;
          }}
        />
      )}
    />
  );
}
