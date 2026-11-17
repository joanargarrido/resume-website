import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeSupabase } from "../../../tests/fakeSupabase";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }),
}));

const createServiceClient = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createServiceClient: () => createServiceClient(),
}));

const sendContactEmail = vi.fn();
vi.mock("@/lib/email/sendContactEmail", () => ({
  sendContactEmail: (...a: unknown[]) => sendContactEmail(...a),
}));

import { submitContact } from "./contact";

const valid = {
  name: "Bob",
  email: "bob@example.com",
  message: "Hello, lovely site!",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("submitContact", () => {
  it("rejects invalid input", async () => {
    const result = await submitContact({ ...valid, email: "nope" });
    expect(result.ok).toBe(false);
    expect(createServiceClient).not.toHaveBeenCalled();
  });

  it("silently succeeds for honeypot hits without saving", async () => {
    const result = await submitContact({
      ...valid,
      website: "http://spam.example",
    });
    expect(result).toEqual({ ok: true });
    expect(createServiceClient).not.toHaveBeenCalled();
  });

  it("saves the message and emails it", async () => {
    const { client, calls } = fakeSupabase({ count: 0 });
    createServiceClient.mockReturnValue(client);

    const result = await submitContact(valid);

    expect(result).toEqual({ ok: true });
    const inserts = calls.filter((c) => c.method === "insert");
    expect(inserts.map((c) => c.table)).toEqual([
      "contact_rate_limits",
      "contact_messages",
    ]);
    expect(inserts[1].args[0]).toEqual(valid);
    expect(sendContactEmail).toHaveBeenCalledWith(valid);
  });

  it("still saves the message when the email fails", async () => {
    const { client, calls } = fakeSupabase({ count: 0 });
    createServiceClient.mockReturnValue(client);
    sendContactEmail.mockRejectedValue(new Error("resend down"));

    const result = await submitContact(valid);

    expect(result).toEqual({ ok: true });
    expect(
      calls.some(
        (c) => c.table === "contact_messages" && c.method === "insert",
      ),
    ).toBe(true);
  });

  it("rate limits after 3 recent messages from the same IP", async () => {
    const { client, calls } = fakeSupabase({ count: 3 });
    createServiceClient.mockReturnValue(client);

    const result = await submitContact(valid);

    expect(result.ok).toBe(false);
    expect(calls.some((c) => c.method === "insert")).toBe(false);
    expect(sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns a friendly error when saving fails", async () => {
    createServiceClient.mockImplementation(() => {
      throw new Error("no config");
    });
    const result = await submitContact(valid);
    expect(result.ok).toBe(false);
  });
});
