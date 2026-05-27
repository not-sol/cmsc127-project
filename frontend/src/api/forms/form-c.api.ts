// form-c.api.ts
import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import {
  createBaseFormEntry,
  createSupportingDocuments,
  emptyStringToNull,
  FORM_TYPE_NAMES,
  getSupportingDocuments,
  supportingDocumentsToFieldValue,
  toIsoDate,
} from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormCInput = {
  values: FormCValues
  reportId?: number
}

export async function createFormCRecord({ values, reportId: initialReportId }: CreateFormCInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.titlePresented,
    author: "",
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_C,
  })
  const entryId = formData.entry_id

  await createSupportingDocuments({
    entryId,
    value: values.presentationAttachments,
    bucket: STORAGE_BUCKETS.FORM_C,
    documentType: "attachments",
    required: true,
  })

  // 3. Insert into isip_oral_forms using the returned entry_id
  const { error: isipError } = await supabase
    .from("isip_oral_forms")
    .insert({
      entry_id: entryId,
      paper_title: values.titlePresented,
      presentation_type: values.presentationType,   // "oral" | "poster"
      event_type: values.eventType,                 // "conference" | "forum" | "seminar" | "workshop"
      remarks: emptyStringToNull(values.presentationRemarks),
      related_kras: emptyStringToNull(values.presentationRelatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP oral entry:", isipError)
    throw isipError
  }

  // 4. Insert into pbms_oral_forms using the same entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_oral_forms")
    .insert({
      entry_id: entryId,
      linked_research: values.researchTitle2,
      conference_title: values.eventTitle,
      organizer_name: values.organizerName,
      conference_location: values.conferenceLocation,
      venue: values.conferenceAddress,
      conference_start_date: toIsoDate(values.conferenceStartDate),
      conference_end_date: values.conferenceEndDate ? toIsoDate(values.conferenceEndDate) : null,
      presentation_date: toIsoDate(values.presentationDate),
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS oral entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormCRecord(entryId: number): Promise<FormCValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_oral_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP oral entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_oral_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS oral entry:", pbmsError)
    throw pbmsError
  }

  const attachmentDocuments = await getSupportingDocuments(entryId, "attachments")

  return {
    researchTitle2: pbmsData.linked_research,
    titlePresented: isipData.paper_title,
    presentationType: isipData.presentation_type,
    eventType: isipData.event_type,
    eventTitle: pbmsData.conference_title,
    organizerName: pbmsData.organizer_name,
    conferenceLocation: pbmsData.conference_location,
    conferenceAddress: pbmsData.venue,
    conferenceStartDate: new Date(pbmsData.conference_start_date),
    conferenceEndDate: pbmsData.conference_end_date ? new Date(pbmsData.conference_end_date) : undefined,
    presentationDate: new Date(pbmsData.presentation_date),
    presentationAttachments: supportingDocumentsToFieldValue(attachmentDocuments),
    presentationRemarks: isipData.remarks || "",
    presentationRelatedKRAs: isipData.related_kras || "",
  }
}

