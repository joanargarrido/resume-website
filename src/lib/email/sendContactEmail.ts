import { Resend } from "resend";

export type ContactEmail = { name: string; email: string; message: string };

/** Emails the owner a new contact message (reply-to = the visitor). Throws on failure. */
export async function sendContactEmail({
  name,
  email,
  message,
}: ContactEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) throw new Error("Email is not configured.");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `New message from ${name.replace(/[\r\n]+/g, " ")}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
  if (error) throw new Error(error.message);
}
