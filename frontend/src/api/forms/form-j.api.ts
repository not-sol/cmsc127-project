// form-j.api.ts
import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  submittedBy?: string
}

export async function createFormJRecord({ values, submittedBy }: CreateFormJInput) {
  // 1. Insert into forms table first to satisfy FK constraint
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titleOfMaterial,
      author: values.authors,
      description: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("Error creating forms record:", formError)
    throw formError
  }

  // 2. Insert into isip_authorship_forms using the entry_id from forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_authorship_forms")
    .insert({
      entry_id: formData.entry_id,
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
    console.error("Error creating isip_authorship_forms record:", isipError)
    throw isipError
  }

  return isipData
}