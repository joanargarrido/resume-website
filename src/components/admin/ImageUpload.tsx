"use client";

import { useState } from "react";
import { publicAssetUrl } from "@/lib/env";
import { IMAGE_RULES, uploadPublicAsset, validateFile } from "@/lib/upload";

export function ImageUpload({
  value,
  onChange,
  label = "Photo",
}: {
  value: string;
  onChange: (path: string) => void;
  label?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const current = preview ?? publicAssetUrl(value);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const problem = validateFile(file, IMAGE_RULES);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const path = await uploadPublicAsset(file, "photos");
      setPreview(URL.createObjectURL(file));
      onChange(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="photo-upload" className="block text-sm font-medium">
        {label}
      </label>
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element -- local blob previews can't use next/image
        <img
          src={current}
          alt="Current photo"
          className="size-28 rounded-full object-cover"
        />
      ) : null}
      <input
        id="photo-upload"
        type="file"
        accept={IMAGE_RULES.mimeTypes.join(",")}
        disabled={busy}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="block text-sm"
      />
      <p className="text-xs text-zinc-500">{IMAGE_RULES.label}</p>
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
