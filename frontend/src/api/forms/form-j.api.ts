// form-j.api.ts
import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  entry_id?: string
}

export async function createFormJRecord({ values }: CreateFormJInput) {
  // 1. Insert into isip_authorships_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_authorships_forms")
    .insert({
      material_title: values.titleOfMaterial,
      author: values.authors, // Mapped to authors_list in schema
      year: toIntegerOrNull(values.year),
      attachments: serializeFiles(values.attachments),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  return isipData
}