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
  return value ? value.toISOString() : null
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
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  // The "Bucket not found" error happens here if the bucket does not exist in Supabase
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw new Error(`Failed to upload file to bucket "${bucket}": ${error.message}`);
  }

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
