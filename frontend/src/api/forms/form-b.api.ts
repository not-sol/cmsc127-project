// form-b.api.ts
import type { FormValues as FormBValues } from "@/features/forms/form-b/form-b-schema"
import { emptyStringToNull, logSupabaseError, toIsoDate, toNumberOrNull, uploadFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"

export type CreateFormBInput = {
  values: FormBValues
  reportId?: number
  submittedBy?: string
  existingAttachmentPath?: string | null
}

export type UpdateFormBInput = CreateFormBInput & {
  entryId: number
}

function getAttachmentInputType(value: unknown) {
  if (value instanceof File) return "File"
  if (Array.isArray(value)) return "File[]"
  if (typeof FileList !== "undefined" && value instanceof FileList) return "FileList"
  if (typeof value === "string") return "existing-path"
  if (value === null) return "null"
  return typeof value
}

function assertSingleAttachment(value: unknown, existingAttachmentPath?: string | null) {
  const inputType = getAttachmentInputType(value)
  const hasExistingAttachment =
    typeof value === "string" && value.trim().length > 0
      ? true
      : Boolean(existingAttachmentPath?.trim())

  console.log("[Form B API] supportingAttachments input type:", inputType)
  console.log("[Form B API] existing attachment present:", hasExistingAttachment)

  if (Array.isArray(value)) {
    const fileCount = value.filter((file) => file instanceof File).length

    if (fileCount > 1) {
      throw new Error("Form B accepts exactly one attachment. Please remove extra files.")
    }
  }

  if (typeof FileList !== "undefined" && value instanceof FileList && value.length > 1) {
    throw new Error("Form B accepts exactly one attachment. Please remove extra files.")
  }

  if (!value && !hasExistingAttachment) {
    throw new Error("At least one attachment is required.")
  }
}

async function resolveAttachmentPath(
  value: unknown,
  existingAttachmentPath?: string | null
) {
  assertSingleAttachment(value, existingAttachmentPath)

  if (!value && existingAttachmentPath) {
    return existingAttachmentPath
  }

  const attachmentPath = await uploadFiles(
    value,
    STORAGE_BUCKETS.FORM_B,
    undefined,
    existingAttachmentPath
  )

  if (!attachmentPath) {
    throw new Error("A valid Form B attachment is required before submitting.")
  }

  return attachmentPath
}

function createIsipPayload(values: FormBValues, entryId: number, attachmentPath: string) {
  return {
    entry_id: entryId,
    research_title: values.researchTitle,
    research_type: values.researchType,
    start_date: toIsoDate(values.rStartDate),
    end_date: values.rEndDate ? toIsoDate(values.rEndDate) : null,
    researcher_name: values.researcherNames,
    research_grant: toNumberOrNull(values.upSystemResearchGrantPesos) ?? 0,
    funding_amount: toNumberOrNull(values.externalFundingAmountPesos) ?? 0,
    total_funding: toNumberOrNull(values.totalFundingPesos) ?? 0,
    other_fund_source: emptyStringToNull(values.otherFundSource),
    attachments: attachmentPath,
    remarks: emptyStringToNull(values.researchRemarks),
    related_kras: emptyStringToNull(values.researchRelatedKRAs),
  }
}

function createPbmsPayload(values: FormBValues, entryId: number) {
  return {
    entry_id: entryId,
    contributing_unit: values.contrUnit,
    original_timeframe_months: toNumberOrNull(values.researchTimeframeMonths) ?? 0,
    majority_source_of_funds: values.majoritySource,
  }
}

export async function createFormBRecord({ values, reportId, existingAttachmentPath }: CreateFormBInput) {
  // 1. Upload or reuse the single attachment before inserting rows.
  const attachmentPath = await resolveAttachmentPath(values.supportingAttachments, existingAttachmentPath)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.researchTitle,
      author: values.researcherNames,
      report_id: reportId,
      // form_type_id: 2, // Research Grant
    })
    .select("entry_id")
    .single()

  if (formError) {
    logSupabaseError("[Supabase] Failed to create base form entry", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_research_forms using the returned entry_id
  const isipPayload = createIsipPayload(values, entryId, attachmentPath)

  console.log("[Supabase] Form B ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_research_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP research entry", isipError)
    throw isipError
  }

  // 4. Insert into pbms_research_forms using the same entry_id
  const pbmsPayload = createPbmsPayload(values, entryId)

  console.log("[Supabase] Form B PBMS payload:", pbmsPayload)

  const { error: pbmsError } = await supabase
    .from("pbms_research_forms")
    .insert(pbmsPayload)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to create PBMS research entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}

export async function updateFormBRecord({
  entryId,
  values,
  reportId,
  existingAttachmentPath,
}: UpdateFormBInput) {
  const attachmentPath = await resolveAttachmentPath(values.supportingAttachments, existingAttachmentPath)

  const formPayload = {
    title: values.researchTitle,
    author: values.researcherNames,
    report_id: reportId,
  }
  const isipPayload = createIsipPayload(values, entryId, attachmentPath)
  const pbmsPayload = createPbmsPayload(values, entryId)

  console.log("[Supabase] Form B base update payload:", formPayload)
  console.log("[Supabase] Form B ISIP update payload:", isipPayload)
  console.log("[Supabase] Form B PBMS update payload:", pbmsPayload)

  const { error: formError } = await supabase
    .from("forms")
    .update(formPayload)
    .eq("entry_id", entryId)

  if (formError) {
    logSupabaseError("[Supabase] Failed to update base form entry", formError)
    throw formError
  }

  const { error: isipError } = await supabase
    .from("isip_research_forms")
    .update(isipPayload)
    .eq("entry_id", entryId)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to update ISIP research entry", isipError)
    throw isipError
  }

  const { error: pbmsError } = await supabase
    .from("pbms_research_forms")
    .update(pbmsPayload)
    .eq("entry_id", entryId)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to update PBMS research entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}
