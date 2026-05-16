// form-j.api.ts
import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import { emptyStringToNull, logSupabaseError, toIntegerOrNull, uploadFilesAsStoragePathText } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  reportId?: number
  submittedBy?: string
}

export async function createFormJRecord({ values, reportId }: CreateFormJInput) {
  // 1. Upload attachments first. Store only Supabase Storage path text in the database.
  const attachmentPaths = await uploadFilesAsStoragePathText(values.attachments, STORAGE_BUCKETS.FORM_J)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
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
    logSupabaseError("[Supabase] Failed to create base form entry", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_authorship_forms using the returned entry_id
  const isipPayload = {
    entry_id: entryId,
    material_title: values.titleOfMaterial,
    author: values.authors,
    year: toIntegerOrNull(values.year),
    attachments: attachmentPaths,
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKRAs),
  }

  console.log("[Supabase] Form J ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_authorship_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP authorships entry", isipError)
    throw isipError
  }

  return { entry_id: entryId }
}
