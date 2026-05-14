// form-f.api.ts
import type { FormFValues as FormFValues } from "@/features/forms/form-f/form-f-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormFInput = {
  values: FormFValues
  entry_id?: string
}

export async function createFormFRecord({ values }: CreateFormFInput) {
  // 1. Insert into isip_awards_grants_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_awards_grants_forms")
    .insert({
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

  if (isipError) throw isipError

  return isipData
}