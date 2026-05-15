// form-k.api.ts
import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import { serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormKInput = {
  values: FormKOtherValues
  reportId?: number
}

export async function createFormKRecord({ values, reportId }: CreateFormKInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.title,
      author: "",
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_other_accomplishments_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_other_accomplishments_forms")
    .insert({
      entry_id: entryId,
      attachments: serializeFiles(values.supportingDocuments),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP other accomplishments entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_other_accomplishments_forms
  const { error: pbmsError } = await supabase
    .from("pbms_other_accomplishments_forms")
    .insert({
      entry_id: entryId,
      accomplishment_title: values.title,
      accomplishment_description: values.description,
      accomplishment_date: toIsoDate(values.date),
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS other accomplishments entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}