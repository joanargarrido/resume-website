"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { signIn } from "@/lib/actions/auth";

export function LoginForm() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    setStatus(null);
    // On success the action redirects; it only returns on failure.
    const result = await signIn({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (result && !result.ok) setStatus({ ok: false, message: result.error });
  }

  return (
    <form action={action} className="space-y-4">
      <Field id="email" label="Email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <StatusMessage status={status} />
    </form>
  );
}
