import type { DobDisplay } from "@/types/domain";
import { parseIsoDate } from "./parseDate";

const fullFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthYearFormat = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Age in whole years. A Feb 29 birthday counts as passed on Mar 1 in non-leap years. */
export function calculateAge(
  dob: string,
  now: Date = new Date(),
): number | null {
  const parts = parseIsoDate(dob);
  if (!parts) return null;
  const ny = now.getFullYear();
  const nm = now.getMonth() + 1;
  const nd = now.getDate();
  let age = ny - parts.y;
  if (nm < parts.m || (nm === parts.m && nd < parts.d)) age -= 1;
  return age;
}

/** Formats the date of birth according to the admin's display setting. Empty string = show nothing. */
export function formatDob(
  dob: string | null | undefined,
  mode: DobDisplay,
  now: Date = new Date(),
): string {
  if (!dob || mode === "hidden") return "";
  const parts = parseIsoDate(dob);
  if (!parts) return "";
  const date = new Date(Date.UTC(parts.y, parts.m - 1, parts.d));

  switch (mode) {
    case "full":
      return fullFormat.format(date);
    case "month_year":
      return monthYearFormat.format(date);
    case "age": {
      const age = calculateAge(dob, now);
      return age === null ? "" : `${age} years old`;
    }
    default:
      return "";
  }
}
