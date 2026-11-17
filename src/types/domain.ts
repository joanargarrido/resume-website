import type { Database } from "./database";

type Tables = Database["public"]["Tables"];

export type Profile = Tables["profile"]["Row"];
export type Education = Tables["education"]["Row"];
export type Experience = Tables["experience"]["Row"];
export type Skill = Tables["skills"]["Row"];
export type ContactMessage = Tables["contact_messages"]["Row"];
export type DobDisplay = Database["public"]["Enums"]["dob_display"];

export type Resume = {
  profile: Profile | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
};
