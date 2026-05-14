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
      attachments: serializeFiles(values.attachments),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_authorships_forms
  const { error: pbmsError } = await supabase
    .from("pbms_authorships_forms")
    .insert({
      entry_id: isipData.entry_id,
      material_title: values.titleOfMaterial,
      authors_list: values.authors, // Mapped to authors_list in schema
      publication_year: toIntegerOrNull(values.year),
    })

  if (pbmsError) throw pbmsError

  return isipData
}