import { supabase } from "@/lib/supabase/client"

export type SerializedFile = {
  name: string
  size: number
  type: string
  lastModified: number
}

export function emptyStringToNull(value?: string | null) {
  if (value === undefined || value === null) {
    return null
  }

  const trimmedValue = value.trim()

  return trimmedValue.length > 0 ? trimmedValue : null
}

export function toIsoDate(value?: Date | null) {
  if (!value) {
    return null
  }

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function toNumberOrNull(value?: string | null) {
  const normalizedValue = emptyStringToNull(value)

  if (!normalizedValue) {
    return null
  }

  const parsedValue = Number(normalizedValue.replaceAll(",", ""))

  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function toIntegerOrNull(value?: string | null) {
  const parsedValue = toNumberOrNull(value)

  return parsedValue === null ? null : Math.trunc(parsedValue)
}

export function serializeFiles(value: unknown): SerializedFile[] {
  const files =
    value instanceof File
      ? [value]
      : Array.isArray(value)
        ? value.filter((f): f is File => f instanceof File)
        : []

  return files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }))
}

export async function uploadFile(file: File, bucket: string, path?: string): Promise<string> {
  const uniqueId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const safeName = file.name.replaceAll(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "")
  const fileName = `${uniqueId}-${safeName || "upload"}`
  const filePath = path ? `${path}/${fileName}` : fileName;

  console.log(`[Supabase Storage] Attempting upload to bucket: "${bucket}", path: "${filePath}"`);

  // The "Bucket not found" error happens here if the bucket does not exist in Supabase
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error(`[Supabase Storage] Upload failed for bucket "${bucket}":`, error);
    throw new Error(`Failed to upload file to bucket "${bucket}": ${error.message}`);
  }

  console.log(`[Supabase Storage] Successfully uploaded to "${bucket}/${filePath}"`);
  return filePath;
}

export async function uploadFiles(value: unknown, bucket: string, path?: string): Promise<string | null> {
  if (!value) return null;

  // If it's already a string (existing attachment), just return it
  if (typeof value === "string") return value;

  const files = value instanceof File ? [value] : Array.isArray(value) ? value.filter((f): f is File => f instanceof File) : [];

  if (files.length === 0) return null;

  // For now, we only handle the first file if it's a single text column
  const uploadedPath = await uploadFile(files[0], bucket, path);
  return uploadedPath;
}

export async function uploadAllFiles(value: unknown, bucket: string, path?: string): Promise<string[]> {
  if (!value) return [];

  if (typeof value === "string") return value.trim() ? [value] : [];

  const files =
    value instanceof File
      ? [value]
      : Array.isArray(value)
        ? value.filter((file): file is File => file instanceof File)
        : [];

  if (files.length === 0) return [];

  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      uploadedPaths.push(await uploadFile(file, bucket, path));
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      const { error: cleanupError } = await supabase.storage
        .from(bucket)
        .remove(uploadedPaths);

      if (cleanupError) {
        console.error(`[Supabase Storage] Failed to clean up uploads in bucket "${bucket}":`, cleanupError);
      }
    }

    throw error;
  }

  return uploadedPaths;
}

export async function insertFormRecord<TPayload extends Record<string, unknown>>(
  table: string,
  payload: TPayload
) {
  const { data, error } = await supabase
    .from(table)
    .insert(payload as never)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as TPayload & { id: string }
}

export function getMutationErrorMessage(error: unknown) {
  if (!error) {
    return undefined
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong while submitting the form."
}
