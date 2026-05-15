// form-e.api.ts
import type { FormEValues } from "@/features/forms/form-e/form-e-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormEInput = {
  values: FormEValues
  userId: string
}

export async function createFormERecord({ values, userId }: CreateFormEInput) {
  try {
    const { data, error } = await supabase
      .from("form_e_creative_work_outputs")
      .insert({
        submitted_by: userId,
        linked_research: values.linkedResearch,
        title_of_artistic_work: values.titleOfArtisticWork,
        type_of_output: values.typeOfOutput,
        other_type: emptyStringToNull(values.otherType),
        type_of_public_event: values.typeOfPublicEvent,
        title_of_event: values.titleOfEvent,
        organizer: values.organizer,
        location_scope: values.locationScope,
        event_venue_city_country: values.eventVenueCityCountry,
        event_start_date: toIsoDate(values.eventStartDate),
        event_end_date: toIsoDate(values.eventEndDate),
        first_shown_released_date: toIsoDate(values.firstShownReleasedDate),
        utilization: values.utilization,
        proof_of_research_output: serializeFiles(values.proofOfResearchOutput),
        proof_of_utilization: serializeFiles(values.proofOfUtilization),
        remarks: emptyStringToNull(values.remarks),
        related_kras: emptyStringToNull(values.relatedKras),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormERecord:", error)
    throw error
  }
}
