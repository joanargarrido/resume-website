"use client";

import { useState } from "react";
import { publicAssetUrl } from "@/lib/env";
import { PDF_RULES, uploadPublicAsset, validateFile } from "@/lib/upload";

export function PdfUpload({
  value,
  onChange,
  label = "CV (PDF)",
}: {
  value: string;
  onChange: (path: string) => void;
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const url = publicAssetUrl(value);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = validateFile(file, PDF_RULES);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      onChange(await uploadPublicAsset(file, "cv"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="cv-upload" className="block text-sm font-medium">
        {label}
      </label>
      {value ? (
        <p className="text-sm">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Current CV
            </a>
          ) : (
            "CV uploaded"
          )}{" "}
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-2 text-red-600 underline"
          >
            Remove
          </button>
        </p>
      ) : null}
      <input
        id="cv-upload"
        type="file"
        accept="application/pdf"
        disabled={busy}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="block text-sm"
      />
      <p className="text-xs text-zinc-500">{PDF_RULES.label}</p>
      {busy ? (
        <p role="status" className="text-sm">
          Uploading…
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
