import { z } from "zod";
import {
  optionalDate,
  optionalText,
  requiredDate,
  requiredText,
} from "./common";

export const educationSchema = z
  .object({
    institution: requiredText(160, "Institution"),
    degree: requiredText(160, "Degree"),
    field: optionalText(160),
    start_date: requiredDate,
    end_date: optionalDate,
    description: optionalText(2000),
  })
  .refine((v) => v.end_date === "" || v.end_date >= v.start_date, {
    message: "End date must be after the start date",
    path: ["end_date"],
  });

export type EducationInput = z.infer<typeof educationSchema>;
