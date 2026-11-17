import { parseIsoDate } from "./parseDate";

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonth(value: string): string {
  const p = parseIsoDate(value);
  return p ? monthYear.format(new Date(Date.UTC(p.y, p.m - 1, p.d))) : "";
}

/** "Mar 2022 – Present" for ongoing ranges, "Sep 2018 – Feb 2022" otherwise. */
export function formatDateRange(
  start: string,
  end: string | null | undefined,
): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
