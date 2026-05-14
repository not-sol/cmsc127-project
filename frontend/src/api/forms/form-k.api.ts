// form-k.api.ts
import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import { serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormKInput = {
  values: FormKOtherValues
  entry_id?: string
}

export async function createFormKRecord({ values }: CreateFormKInput) {
  // 1. Insert into isip_other_accomplishments_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_other_accomplishments_forms")
    .insert({
      attachments: serializeFiles(values.supportingDocuments),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_other_accomplishments_forms
  const { error: pbmsError } = await supabase
    .from("pbms_other_accomplishments_forms")
    .insert({
      entry_id: isipData.entry_id,
      accomplishment_title: values.title,
      accomplishment_description: values.description,
      accomplishment_date: toIsoDate(values.date),
    })

  if (pbmsError) throw pbmsError

  return isipData
}