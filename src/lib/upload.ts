import { createClient } from "@/lib/supabase/client";

export type UploadRules = {
  mimeTypes: string[];
  maxBytes: number;
  label: string;
};

export const IMAGE_RULES: UploadRules = {
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * 1024 * 1024,
  label: "JPG, PNG or WebP up to 5 MB",
};

export const PDF_RULES: UploadRules = {
  mimeTypes: ["application/pdf"],
  maxBytes: 10 * 1024 * 1024,
  label: "PDF up to 10 MB",
};

/** Returns an error message, or null when the file is acceptable. */
export function validateFile(
  file: Pick<File, "type" | "size">,
  rules: UploadRules,
): string | null {
  if (!rules.mimeTypes.includes(file.type))
    return `Unsupported file type. Use ${rules.label}.`;
  if (file.size > rules.maxBytes)
    return `File is too large. Use ${rules.label}.`;
  return null;
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Uploads straight to the storage bucket (protected by RLS) and returns the stored path. */
export async function uploadPublicAsset(
  file: File,
  folder: "photos" | "cv",
): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}.${EXTENSIONS[file.type] ?? "bin"}`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("public-assets")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return path;
}
