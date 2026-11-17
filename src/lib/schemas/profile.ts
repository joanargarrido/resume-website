import { z } from "zod";
import {
  optionalDate,
  optionalEmail,
  optionalText,
  optionalUrl,
  requiredText,
} from "./common";

export const profileSchema = z.object({
  full_name: requiredText(120, "Name"),
  date_of_birth: optionalDate,
  dob_display: z.enum(["full", "month_year", "age", "hidden"]),
  city: optionalText(120),
  headline: optionalText(160),
  bio: optionalText(4000),
  linkedin_url: optionalUrl,
  github_url: optionalUrl,
  email_public: optionalEmail,
  photo_path: optionalText(300),
  cv_path: optionalText(300),
});

export type ProfileInput = z.infer<typeof profileSchema>;
