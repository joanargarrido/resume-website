import { z } from "zod";
import { optionalText, requiredText } from "./common";

export const skillSchema = z.object({
  name: requiredText(80, "Name"),
  category: optionalText(80),
  /** '' = no level. Stored as a number 1-5. */
  level: z.enum(["", "1", "2", "3", "4", "5"]),
});

export type SkillInput = z.infer<typeof skillSchema>;
