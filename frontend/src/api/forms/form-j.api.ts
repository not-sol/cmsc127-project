// form-j.api.ts
import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import {
  createBaseFormEntry,
  createSupportingDocuments,
  emptyStringToNull,
  FORM_TYPE_NAMES,
  getSupportingDocuments,
  logSupabaseError,
  supportingDocumentsToFieldValue,
  toIntegerOrNull,
} from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  reportId?: number
  submittedBy?: string
}

export async function createFormJRecord({ values, reportId: initialReportId }: CreateFormJInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.titleOfMaterial,
    author: values.authors,
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_J,
  })
  const entryId = formData.entry_id

  await createSupportingDocuments({
    entryId,
    value: values.attachments,
    bucket: STORAGE_BUCKETS.FORM_J,
    documentType: "attachments",
  })

  // 3. Insert into isip_authorship_forms using the returned entry_id
  const isipPayload = {
    entry_id: entryId,
    material_title: values.titleOfMaterial,
    author: values.authors,
    year: toIntegerOrNull(values.year),
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

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormJRecord(entryId: number): Promise<FormJAuthorshipValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_authorship_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP authorship entry:", isipError)
    throw isipError
  }

  const attachmentDocuments = await getSupportingDocuments(entryId, "attachments")

  return {
    titleOfMaterial: isipData.material_title,
    authors: isipData.author,
    year: String(isipData.year),
    attachments: supportingDocumentsToFieldValue(attachmentDocuments) as unknown as FormJAuthorshipValues["attachments"],
    remarks: isipData.remarks || "",
    relatedKRAs: isipData.related_kras || "",
  }
}
