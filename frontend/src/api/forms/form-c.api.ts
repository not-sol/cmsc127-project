// form-c.api.ts
import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormCInput = {
  values: FormCValues
  entry_id?: string
}

export async function createFormCRecord({ values }: CreateFormCInput) {
  // 1. Insert into isip_oral_forms to get the entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_oral_forms")
    .insert({
      paper_title: values.titlePresented,
      presentation_type: values.presentationType,   // "oral" | "poster"
      event_type: values.eventType,                 // "conference" | "forum" | "seminar" | "workshop"
      attachments: serializeFiles(values.presentationAttachments),
      remarks: emptyStringToNull(values.presentationRemarks),
      related_kras: emptyStringToNull(values.presentationRelatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_oral_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_oral_forms")
    .insert({
      entry_id: isipData.entry_id,
      linked_research: values.researchTitle2,
      conference_title: values.eventTitle,
      organizer_name: values.organizerName,
      conference_location: values.conferenceLocation,
      venue: values.conferenceAddress,
      conference_start_date: toIsoDate(values.conferenceStartDate),
      conference_end_date: values.conferenceEndDate ? toIsoDate(values.conferenceEndDate) : null,
      presentation_date: toIsoDate(values.presentationDate),
    })

  if (pbmsError) throw pbmsError

  return isipData
}