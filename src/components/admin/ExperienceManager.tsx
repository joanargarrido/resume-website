"use client";

import {
  createExperience,
  deleteExperience,
  moveExperience,
  updateExperience,
} from "@/lib/actions/experience";
import { formatDateRange } from "@/lib/format/formatDateRange";
import type { Experience } from "@/types/domain";
import { ExperienceForm } from "./ExperienceForm";
import { ResourceManager } from "./ItemList";

export function ExperienceManager({ items }: { items: Experience[] }) {
  return (
    <ResourceManager
      noun="job"
      items={items}
      describe={(e) => ({
        id: e.id,
        title: `${e.role} – ${e.company}`,
        subtitle: formatDateRange(e.start_date, e.end_date),
      })}
      onDelete={deleteExperience}
      onMove={moveExperience}
      renderForm={({ item, done, cancel }) => (
        <ExperienceForm
          key={item?.id ?? "new"}
          initial={
            item
              ? {
                  company: item.company,
                  role: item.role,
                  location: item.location ?? "",
                  start_date: item.start_date,
                  end_date: item.end_date ?? "",
                  description: item.description ?? "",
                  company_url: item.company_url ?? "",
                }
              : undefined
          }
          onCancel={cancel}
          onSubmit={async (values) => {
            const result = item
              ? await updateExperience(item.id, values)
              : await createExperience(values);
            if (result.ok) done();
            return result;
          }}
        />
      )}
    />
  );
}
