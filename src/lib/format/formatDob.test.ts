import { describe, expect, it } from "vitest";
import { calculateAge, formatDob } from "./formatDob";

const now = new Date(2026, 5, 15); // 15 June 2026 (local)

describe("formatDob", () => {
  it("formats the full date", () => {
    expect(formatDob("1992-06-15", "full", now)).toBe("15 June 1992");
  });

  it("formats month and year", () => {
    expect(formatDob("1992-06-15", "month_year", now)).toBe("June 1992");
  });

  it("formats age only", () => {
    expect(formatDob("1992-06-15", "age", now)).toBe("34 years old");
  });

  it("returns nothing when hidden or missing", () => {
    expect(formatDob("1992-06-15", "hidden", now)).toBe("");
    expect(formatDob(null, "full", now)).toBe("");
    expect(formatDob("not-a-date", "full", now)).toBe("");
  });

  it("is not affected by the local timezone offset", () => {
    expect(formatDob("2000-01-01", "full", now)).toBe("1 January 2000");
  });
});

describe("calculateAge", () => {
  it("has not had the birthday yet earlier in the year", () => {
    expect(calculateAge("1992-06-16", now)).toBe(33);
  });

  it("counts the birthday on the day itself", () => {
    expect(calculateAge("1992-06-15", now)).toBe(34);
  });

  it("has had the birthday after it passed", () => {
    expect(calculateAge("1992-06-14", now)).toBe(34);
  });

  it("treats a Feb 29 birthday as passed on Mar 1 in a non-leap year", () => {
    expect(calculateAge("2000-02-29", new Date(2025, 1, 28))).toBe(24);
    expect(calculateAge("2000-02-29", new Date(2025, 2, 1))).toBe(25);
  });

  it("counts a Feb 29 birthday on Feb 29 of a leap year", () => {
    expect(calculateAge("2000-02-29", new Date(2024, 1, 29))).toBe(24);
  });

  it("returns null for invalid input", () => {
    expect(calculateAge("2000-02-30", now)).toBeNull();
  });
});
