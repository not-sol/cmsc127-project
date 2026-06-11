// form-f.api.ts
import type { FormFValues } from "@/features/forms/form-f/form-f-schema"
import {
  createBaseFormEntry,
  createSupportingDocuments,
  emptyStringToNull,
  FORM_TYPE_NAMES,
  getSupportingDocuments,
  logSupabaseError,
  supportingDocumentsToFieldValue,
  toIsoDate,
} from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormFInput = {
  values: FormFValues
  reportId?: number
  submittedBy?: string
  existingAttachmentPath?: string | null
}

const ISIP_AWARDS_TABLE = "isip_awards_forms"
const LEGACY_MISSING_TABLE = "isip_awards_grants_forms"

function getAttachmentInputType(value: unknown) {
  if (value instanceof File) return "File"
  if (Array.isArray(value)) return "File[]"
  if (typeof FileList !== "undefined" && value instanceof FileList) return "FileList"
  if (typeof value === "string") return "existing-path"
  if (value === null) return "null"
  return typeof value
}

function validateAttachment(value: unknown) {
  console.log("[Form F API] attachments input type:", getAttachmentInputType(value))

  if (Array.isArray(value) && value.filter((file) => file instanceof File).length > 1) {
    throw new Error("Form F supports only one attachment. Please remove extra files.")
  }

  if (typeof FileList !== "undefined" && value instanceof FileList && value.length > 1) {
    throw new Error("Form F supports only one attachment. Please remove extra files.")
  }

}

export async function createFormFRecord({ values, reportId: initialReportId, existingAttachmentPath }: CreateFormFInput) {
  console.log("[Supabase] Form F expected table:", ISIP_AWARDS_TABLE)
  console.log("[Supabase] Form F legacy missing table:", LEGACY_MISSING_TABLE)

  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  validateAttachment(values.attachments)

  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.awardGrantTitle,
    author: "",
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_F,
  })
  const entryId = formData.entry_id

  await createSupportingDocuments({
    entryId,
    value: values.attachments || existingAttachmentPath,
    bucket: STORAGE_BUCKETS.FORM_F,
    documentType: "attachments",
  })

  // 3. Insert into the real ISIP awards table using the returned entry_id.
  const isipPayload = {
    entry_id: entryId,
    type: values.type,
    award: values.awardGrantTitle,
    source: values.sourceAwardingBody,
    details: values.details,
    start_date: toIsoDate(values.startDate),
    end_date: toIsoDate(values.endDate),
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKras),
  }

  console.log("[Supabase] Form F ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from(ISIP_AWARDS_TABLE)
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP awards entry", isipError)
    throw isipError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormFRecord(entryId: number): Promise<FormFValues> {
  const { data: isipData, error: isipError } = await supabase
    .from(ISIP_AWARDS_TABLE)
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP awards entry:", isipError)
    throw isipError
  }

  const attachmentDocuments = await getSupportingDocuments(entryId, "attachments")

  return {
    type: isipData.type,
    awardGrantTitle: isipData.award,
    sourceAwardingBody: isipData.source,
    details: isipData.details,
    startDate: isipData.start_date ? new Date(isipData.start_date) : undefined,
    endDate: isipData.end_date ? new Date(isipData.end_date) : undefined,
    attachments: supportingDocumentsToFieldValue(attachmentDocuments),
    remarks: isipData.remarks || "",
    relatedKras: isipData.related_kras || "",
  }
}
