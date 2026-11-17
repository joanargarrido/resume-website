import { z } from "zod";
import {
  optionalDate,
  optionalText,
  optionalUrl,
  requiredDate,
  requiredText,
} from "./common";

export const experienceSchema = z
  .object({
    company: requiredText(160, "Company"),
    role: requiredText(160, "Role"),
    location: optionalText(160),
    start_date: requiredDate,
    end_date: optionalDate,
    description: optionalText(3000),
    company_url: optionalUrl,
  })
  .refine((v) => v.end_date === "" || v.end_date >= v.start_date, {
    message: "End date must be after the start date",
    path: ["end_date"],
  });

export type ExperienceInput = z.infer<typeof experienceSchema>;
