"use client";

import {
  createEducation,
  deleteEducation,
  moveEducation,
  updateEducation,
} from "@/lib/actions/education";
import { formatDateRange } from "@/lib/format/formatDateRange";
import type { Education } from "@/types/domain";
import { EducationForm } from "./EducationForm";
import { ResourceManager } from "./ItemList";

export function EducationManager({ items }: { items: Education[] }) {
  return (
    <ResourceManager
      noun="education"
      items={items}
      describe={(e) => ({
        id: e.id,
        title: `${e.degree} – ${e.institution}`,
        subtitle: formatDateRange(e.start_date, e.end_date),
      })}
      onDelete={deleteEducation}
      onMove={moveEducation}
      renderForm={({ item, done, cancel }) => (
        <EducationForm
          key={item?.id ?? "new"}
          initial={
            item
              ? {
                  institution: item.institution,
                  degree: item.degree,
                  field: item.field ?? "",
                  start_date: item.start_date,
                  end_date: item.end_date ?? "",
                  description: item.description ?? "",
                }
              : undefined
          }
          onCancel={cancel}
          onSubmit={async (values) => {
            const result = item
              ? await updateEducation(item.id, values)
              : await createEducation(values);
            if (result.ok) done();
            return result;
          }}
        />
      )}
    />
  );
}
