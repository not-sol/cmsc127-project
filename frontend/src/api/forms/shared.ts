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
  if (value instanceof File) {
    return [
      {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      },
    ]
  }

  if (Array.isArray(value)) {
    return value
      .filter((file): file is File => file instanceof File)
      .map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }))
  }

  return []
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
