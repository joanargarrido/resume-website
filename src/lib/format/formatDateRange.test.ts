import { describe, expect, it } from "vitest";
import { formatDateRange } from "./formatDateRange";

describe("formatDateRange", () => {
  it("shows Present for ongoing ranges", () => {
    expect(formatDateRange("2022-03-01", null)).toBe("Mar 2022 – Present");
  });

  it("shows both ends for finished ranges", () => {
    expect(formatDateRange("2018-09-01", "2022-02-28")).toBe(
      "Sep 2018 – Feb 2022",
    );
  });
});
