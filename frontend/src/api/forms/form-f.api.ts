// form-f.api.ts
import type { FormFValues } from "@/features/forms/form-f/form-f-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormFInput = {
  values: FormFValues
  userId: string
}

export async function createFormFRecord({ values, userId }: CreateFormFInput) {
  try {
    const { data, error } = await supabase
      .from("form_f_awards_and_grants")
      .insert({
        submitted_by: userId,
        type: values.type,
        award_grant_title: values.awardGrantTitle,
        source_awarding_body: values.sourceAwardingBody,
        details: values.details,
        start_date: toIsoDate(values.startDate),
        end_date: toIsoDate(values.endDate),
        attachments: serializeFiles(values.attachments),
        remarks: emptyStringToNull(values.remarks),
        related_kras: emptyStringToNull(values.relatedKras),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormFRecord:", error)
    throw error
  }
}
