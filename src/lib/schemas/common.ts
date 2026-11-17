import { z } from "zod";
import { isValidIsoDate } from "@/lib/format/parseDate";

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Optional text: '' is allowed and later stored as NULL. */
export const optionalText = (max: number) =>
  z.string().trim().max(max, `At most ${max} characters`);

export const requiredText = (max: number, label = "This field") =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `At most ${max} characters`);

export const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || isHttpUrl(v), "Enter a valid http(s) URL");

export const optionalEmail = z
  .string()
  .trim()
  .max(200)
  .refine(
    (v) => v === "" || z.email().safeParse(v).success,
    "Enter a valid email address",
  );

export const requiredDate = z
  .string()
  .refine((v) => isValidIsoDate(v), "Enter a valid date");

export const optionalDate = z
  .string()
  .refine((v) => v === "" || isValidIsoDate(v), "Enter a valid date");

/** Converts '' to null for every string field, ready to be stored. */
export function emptyToNull<T extends Record<string, unknown>>(
  input: T,
): { [K in keyof T]: T[K] extends string ? string | null : T[K] } {
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, v === "" ? null : v]),
  ) as never;
}
