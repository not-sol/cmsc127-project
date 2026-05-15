// form-j.api.ts
import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  reportId?: number
}

export async function createFormJRecord({ values, reportId }: CreateFormJInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titleOfMaterial,
      author: values.authors,
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_authorships_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_authorships_forms")
    .insert({
      entry_id: entryId,
      material_title: values.titleOfMaterial,
      author: values.authors, // Mapped to authors_list in schema
      year: toIntegerOrNull(values.year),
      attachments: serializeFiles(values.attachments),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP authorships entry:", isipError)
    throw isipError
  }

  return { entry_id: entryId }
}