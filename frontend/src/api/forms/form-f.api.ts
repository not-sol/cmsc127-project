// form-f.api.ts
import type { FormFValues as FormFValues } from "@/features/forms/form-f/form-f-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormFInput = {
  values: FormFValues
  reportId?: number
}

export async function createFormFRecord({ values, reportId }: CreateFormFInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.awardGrantTitle,
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

  // 2. Insert into isip_awards_grants_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_awards_grants_forms")
    .insert({
      entry_id: entryId,
      type: values.type,
      award: values.awardGrantTitle,
      source: values.sourceAwardingBody,
      details: values.details,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      attachments: serializeFiles(values.attachments),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKras),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP awards entry:", isipError)
    throw isipError
  }

  return { entry_id: entryId }
}