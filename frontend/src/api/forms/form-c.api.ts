// form-c.api.ts
import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import { emptyStringToNull, toIsoDate, uploadFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"

export type CreateFormCInput = {
  values: FormCValues
  reportId?: number
}

export async function createFormCRecord({ values, reportId }: CreateFormCInput) {
  // 1. Upload files first
  const attachmentPath = await uploadFiles(values.presentationAttachments, STORAGE_BUCKETS.FORM_C)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titlePresented,
      author: "", // Form C doesn't seem to have author in values
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_oral_forms using the returned entry_id
  const { error: isipError } = await supabase
    .from("isip_oral_forms")
    .insert({
      entry_id: entryId,
      paper_title: values.titlePresented,
      presentation_type: values.presentationType,   // "oral" | "poster"
      event_type: values.eventType,                 // "conference" | "forum" | "seminar" | "workshop"
      attachments: attachmentPath || "", // Ensuring it's a string as per schema
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

  return { entry_id: entryId }
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
    presentationAttachments: isipData.attachments,
    presentationRemarks: isipData.remarks || "",
    presentationRelatedKRAs: isipData.related_kras || "",
  }
}

