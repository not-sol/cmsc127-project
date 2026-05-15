// form-k.api.ts
import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import { logSupabaseError, toIsoDate, uploadFilesAsStoragePathText } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"

export type CreateFormKInput = {
  values: FormKOtherValues
  reportId?: number
  submittedBy?: string
}

export async function createFormKRecord({ values, reportId }: CreateFormKInput) {
  // 1. Upload supporting documents first. Store only Supabase Storage path text in the database.
  const supportingDocumentPaths = await uploadFilesAsStoragePathText(
    values.supportingDocuments,
    STORAGE_BUCKETS.FORM_K,
    { required: true }
  )

  // 2. Insert into the base 'forms' table first to get a valid entry_id
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
    logSupabaseError("[Supabase] Failed to create base form entry", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_other_accomplishments_forms using the returned entry_id
  const isipPayload = {
    entry_id: entryId,
    activity_title: values.title,
    start_date: toIsoDate(values.date),
    end_date: values.endDate ? toIsoDate(values.endDate) : null,
    attachments: supportingDocumentPaths,
  }

  console.log("[Supabase] Form K ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_other_accomplishments_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP other accomplishments entry", isipError)
    throw isipError
  }

  // 4. Insert into pbms_other_accomplishments_forms
  const pbmsPayload = {
    entry_id: entryId,
    accomplishment_title: values.title,
    accomplishment_description: values.description,
    accomplishment_date: toIsoDate(values.date),
  }

  console.log("[Supabase] Form K PBMS payload:", pbmsPayload)

  const { error: pbmsError } = await supabase
    .from("pbms_other_accomplishments_forms")
    .insert(pbmsPayload)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to create PBMS other accomplishments entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}
