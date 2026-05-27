// form-g.api.ts
import type { FormGValues as FormGValues } from "@/features/forms/form-g/form-g-schema"
import {
  createBaseFormEntry,
  createSupportingDocuments,
  emptyStringToNull,
  FORM_TYPE_NAMES,
  getSupportingDocuments,
  logSupabaseError,
  supportingDocumentsToFieldValue,
  toIntegerOrNull,
  toIsoDate,
} from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormGInput = {
  values: FormGValues
  reportId?: number
  submittedBy?: string
  existingAttachmentPath?: string | null
}

export async function createFormGRecord({ values, reportId: initialReportId, existingAttachmentPath }: CreateFormGInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.title,
    author: "",
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_G,
  })
  const entryId = formData.entry_id

  await createSupportingDocuments({
    entryId,
    value: values.attachments || existingAttachmentPath,
    bucket: STORAGE_BUCKETS.FORM_G,
    documentType: "attachments",
    required: true,
  })

  // 3. Insert into isip_trainings_forms using the returned entry_id
  const isipPayload = {
    entry_id: entryId,
    activity_type: values.typeOfActivity,
    training_title: values.title,
    venue: values.venue,
    start_date: toIsoDate(values.startDate),
    end_date: toIsoDate(values.endDate),
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKras),
  }

  console.log("[Supabase] Form G ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_trainings_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP trainings entry", isipError)
    throw isipError
  }

  // 4. Insert into pbms_trainings_forms.
  const pbmsPayload = {
    entry_id: entryId,
    contributing_unit: values.contributingUnit,
    special_notes_schedule: emptyStringToNull(values.specialNotes),
    training_hours_required: toIntegerOrNull(values.trainingHours),
    total_trainees_number: toIntegerOrNull(values.totalTrainees),
    majority_share_funding: values.fundingSource,
    sample_size: toIntegerOrNull(values.sampleSize),
    no_of_responses_poor: toIntegerOrNull(values.responsesPoor),
    no_of_responses_fair: toIntegerOrNull(values.responsesFair),
    no_of_responses_satisfactory: toIntegerOrNull(values.responsesSatisfactory),
    no_of_responses_very_satisfactory: toIntegerOrNull(values.responsesVerySatisfactory),
    no_of_responses_outstanding: toIntegerOrNull(values.responsesOutstanding),
    part_extension_program: values.isPartOfExtensionProgram,
    related_extension_program_title: emptyStringToNull(values.relatedExtensionProgram),
  }

  console.log("[Supabase] Form G PBMS payload:", pbmsPayload)

  const { error: pbmsError } = await supabase
    .from("pbms_trainings_forms")
    .insert(pbmsPayload)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to create PBMS trainings entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormGRecord(entryId: number): Promise<FormGValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_trainings_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP trainings entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_trainings_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS trainings entry:", pbmsError)
    throw pbmsError
  }

  const attachmentDocuments = await getSupportingDocuments(entryId, "attachments")

  return {
    contributingUnit: pbmsData.contributing_unit,
    typeOfActivity: isipData.activity_type,
    title: isipData.training_title,
    venue: isipData.venue,
    startDate: new Date(isipData.start_date),
    endDate: new Date(isipData.end_date),
    specialNotes: pbmsData.special_notes_schedule || "",
    trainingHours: String(pbmsData.training_hours_required || 0),
    totalTrainees: String(pbmsData.total_trainees_number || 0),
    fundingSource: pbmsData.majority_share_funding,
    sampleSize: String(pbmsData.sample_size || 0),
    responsesPoor: String(pbmsData.no_of_responses_poor || 0),
    responsesFair: String(pbmsData.no_of_responses_fair || 0),
    responsesSatisfactory: String(pbmsData.no_of_responses_satisfactory || 0),
    responsesVerySatisfactory: String(pbmsData.no_of_responses_very_satisfactory || 0),
    responsesOutstanding: String(pbmsData.no_of_responses_outstanding || 0),
    isPartOfExtensionProgram: pbmsData.part_extension_program,
    relatedExtensionProgram: pbmsData.related_extension_program_title || "",
    attachments: supportingDocumentsToFieldValue(attachmentDocuments),
    remarks: isipData.remarks || "",
    relatedKras: isipData.related_kras || "",
  }
}
