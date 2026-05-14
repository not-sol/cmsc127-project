// form-e.api.ts
import type { FormEValues as FormEValues } from "@/features/forms/form-e/form-e-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormEInput = {
  values: FormEValues
  entry_id?: string
}

export async function createFormERecord({ values }: CreateFormEInput) {
  // 1. Insert into isip_creative_work_forms to get the entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_creative_work_forms")
    .insert({
      creative_work_title: values.titleOfArtisticWork,
      other_type: emptyStringToNull(values.otherType),
      event_start_date: toIsoDate(values.eventStartDate),
      event_end_date: toIsoDate(values.eventEndDate),
      research_proof: serializeFiles(values.proofOfResearchOutput),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKras),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_creative_work_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_creative_work_forms")
    .insert({
      entry_id: isipData.entry_id,
      linked_research: values.linkedResearch,
      output_type: values.typeOfOutput,
      public_event_type: values.typeOfPublicEvent,
      organizer_name: values.organizer,
      event_scope: values.locationScope,
      event_venue: values.eventVenueCityCountry,
      date_released: toIsoDate(values.firstShownReleasedDate),
      utilization_research_output: values.utilization,
      utilization_proof: serializeFiles(values.proofOfUtilization),
      event_title: values.titleOfEvent,
    })

  if (pbmsError) throw pbmsError

  return isipData
}