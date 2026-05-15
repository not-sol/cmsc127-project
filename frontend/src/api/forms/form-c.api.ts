// form-c.api.ts
import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormCInput = {
  values: FormCValues
  userId: string
}

export async function createFormCRecord({ values, userId }: CreateFormCInput) {
  try {
    const { data, error } = await supabase
      .from("form_c_presentations")
      .insert({
        submitted_by: userId,
        linked_research_title: values.researchTitle2,
        presented_title: values.titlePresented,
        presentation_type: values.presentationType,
        event_type: values.eventType,
        event_title: values.eventTitle,
        organizer_name: values.organizerName,
        conference_location: values.conferenceLocation,
        conference_address: values.conferenceAddress,
        conference_start_date: toIsoDate(values.conferenceStartDate),
        conference_end_date: values.conferenceEndDate ? toIsoDate(values.conferenceEndDate) : null,
        presentation_date: toIsoDate(values.presentationDate),
        attachments: serializeFiles(values.presentationAttachments),
        remarks: emptyStringToNull(values.presentationRemarks),
        related_kras: emptyStringToNull(values.presentationRelatedKRAs),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormCRecord:", error)
    throw error
  }
}
