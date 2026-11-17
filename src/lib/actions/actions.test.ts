import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "../../../tests/fakeSupabase";

const revalidatePath = vi.fn();
const updateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (...a: unknown[]) => revalidatePath(...a),
  updateTag: (...a: unknown[]) => updateTag(...a),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

const requireAdmin = vi.fn();
vi.mock("@/lib/auth", async () => {
  class UnauthorizedError extends Error {}
  return { requireAdmin: () => requireAdmin(), UnauthorizedError };
});

import { UnauthorizedError } from "@/lib/auth";
import { createEducation, deleteEducation } from "./education";
import { createExperience, moveExperience } from "./experience";
import { saveProfile } from "./profile";
import { createSkill } from "./skills";

const validProfile = {
  full_name: "Ada",
  date_of_birth: "",
  dob_display: "hidden" as const,
  city: "",
  headline: "",
  bio: "",
  linkedin_url: "",
  github_url: "",
  email_public: "",
  photo_path: "",
  cv_path: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("admin server actions", () => {
  it("reject when there is no admin session and never touch the database", async () => {
    requireAdmin.mockRejectedValue(new UnauthorizedError());
    const result = await saveProfile(validProfile);
    expect(result).toEqual({
      ok: false,
      error: "You must be signed in as admin.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("reject invalid data before writing", async () => {
    const { client, calls } = fakeSupabase();
    requireAdmin.mockResolvedValue({ supabase: client });
    const result = await saveProfile({ ...validProfile, full_name: "" });
    expect(result.ok).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it("save the profile, converting empty strings to null, then revalidate", async () => {
    const { client, calls } = fakeSupabase();
    requireAdmin.mockResolvedValue({ supabase: client });

    const result = await saveProfile(validProfile);

    expect(result).toEqual({ ok: true });
    const upsert = calls.find((c) => c.method === "upsert");
    expect(upsert?.table).toBe("profile");
    expect(upsert?.args[0]).toMatchObject({
      id: 1,
      full_name: "Ada",
      city: null,
      bio: null,
    });
    expect(updateTag).toHaveBeenCalledWith("resume");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("create education and revalidate", async () => {
    const { client, calls } = fakeSupabase({ data: [{ sort_order: 3 }] });
    requireAdmin.mockResolvedValue({ supabase: client });

    const result = await createEducation({
      institution: "Uni",
      degree: "BSc",
      field: "",
      start_date: "2015-09-01",
      end_date: "",
      description: "",
    });

    expect(result.ok).toBe(true);
    const insert = calls.find((c) => c.method === "insert");
    // New education goes on top: min sort_order (3) - 1.
    expect(insert?.args[0]).toMatchObject({
      institution: "Uni",
      end_date: null,
      sort_order: 2,
    });
    expect(updateTag).toHaveBeenCalledWith("resume");
  });

  it("reject invalid experience", async () => {
    const { client } = fakeSupabase();
    requireAdmin.mockResolvedValue({ supabase: client });
    const result = await createExperience({
      company: "A",
      role: "B",
      location: "",
      start_date: "2020-01-01",
      end_date: "2019-01-01",
      description: "",
      company_url: "",
    });
    expect(result.ok).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("store skill level as a number", async () => {
    const { client, calls } = fakeSupabase({ data: [] });
    requireAdmin.mockResolvedValue({ supabase: client });
    await createSkill({ name: "TS", category: "", level: "4" });
    const insert = calls.find((c) => c.method === "insert");
    expect(insert?.args[0]).toMatchObject({
      name: "TS",
      category: null,
      level: 4,
      sort_order: 0,
    });
  });

  it("delete and revalidate", async () => {
    const { client, calls } = fakeSupabase();
    requireAdmin.mockResolvedValue({ supabase: client });
    const result = await deleteEducation("abc");
    expect(result.ok).toBe(true);
    expect(calls.map((c) => c.method)).toEqual(
      expect.arrayContaining(["delete", "eq"]),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("reorder by rewriting sort_order and revalidate", async () => {
    const rows = [
      { id: "a", sort_order: 0 },
      { id: "b", sort_order: 1 },
    ];
    const { client, calls } = fakeSupabase({ data: rows });
    requireAdmin.mockResolvedValue({ supabase: client });

    const result = await moveExperience("b", "up");

    expect(result.ok).toBe(true);
    const updates = calls
      .filter((c) => c.method === "update")
      .map((c) => c.args[0]);
    expect(updates).toEqual([{ sort_order: 0 }, { sort_order: 1 }]);
    expect(updateTag).toHaveBeenCalledWith("resume");
  });

  it("surface database errors as a generic failure", async () => {
    const { client } = fakeSupabase({ error: { message: "boom" } });
    requireAdmin.mockResolvedValue({ supabase: client });
    const result = await deleteEducation("abc");
    expect(result).toEqual({
      ok: false,
      error: "Something went wrong. Please try again.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
