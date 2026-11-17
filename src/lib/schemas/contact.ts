import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters")
    .max(5000, "Your message is too long"),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
