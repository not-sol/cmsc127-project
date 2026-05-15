// form-e.api.ts
import type { FormEValues as FormEValues } from "@/features/forms/form-e/form-e-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormEInput = {
  values: FormEValues
  reportId?: number
}

export async function createFormERecord({ values, reportId }: CreateFormEInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titleOfArtisticWork,
      author: "", // Form E doesn't seem to have author in values
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_creative_work_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_creative_work_forms")
    .insert({
      entry_id: entryId,
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

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP creative work entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_creative_work_forms using the same entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_creative_work_forms")
    .insert({
      entry_id: entryId,
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

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS creative work entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}