"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { sendContactEmail } from "@/lib/email/sendContactEmail";
import { contactSchema, type ContactInput } from "@/lib/schemas/contact";
import { createServiceClient } from "@/lib/supabase/admin";
import { fail, ok, type ActionResult } from "./result";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 10;

async function hashedClientIp(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function submitContact(
  input: ContactInput,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return fail(parsed.error.issues[0]?.message ?? "Invalid message");

  // Honeypot: pretend success so bots learn nothing.
  if (parsed.data.website) return ok;

  try {
    const supabase = createServiceClient();
    const ipHash = await hashedClientIp();

    const since = new Date(
      Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000,
    ).toISOString();
    const { count, error: countError } = await supabase
      .from("contact_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (countError) throw countError;
    if ((count ?? 0) >= RATE_LIMIT_MAX) {
      return fail("Too many messages. Please try again in a few minutes.");
    }

    const { error: limitError } = await supabase
      .from("contact_rate_limits")
      .insert({ ip_hash: ipHash });
    if (limitError) throw limitError;

    const { name, email, message } = parsed.data;
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, message });
    if (error) throw error;

    // The message is already saved; an email failure must not lose it or fail the request.
    try {
      await sendContactEmail({ name, email, message });
    } catch (emailError) {
      console.error("Contact email failed", emailError);
    }
    return ok;
  } catch (error) {
    console.error(error);
    return fail(
      "Sorry, your message could not be sent. Please try again later.",
    );
  }
}
