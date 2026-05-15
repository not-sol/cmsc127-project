// form-c.api.ts
import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormCInput = {
  values: FormCValues
  reportId?: number
}

export async function createFormCRecord({ values, reportId }: CreateFormCInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titlePresented,
      author: "", // values doesn't seem to have author for Form C?
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_oral_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_oral_forms")
    .insert({
      entry_id: entryId,
      paper_title: values.titlePresented,
      presentation_type: values.presentationType,   // "oral" | "poster"
      event_type: values.eventType,                 // "conference" | "forum" | "seminar" | "workshop"
      attachments: serializeFiles(values.presentationAttachments),
      remarks: emptyStringToNull(values.presentationRemarks),
      related_kras: emptyStringToNull(values.presentationRelatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP oral entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_oral_forms using the same entry_id
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