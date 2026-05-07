import type { FormEValues } from "@/features/forms/form-e/form-e-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_E_TABLE = "form_e_creative_work_outputs"

export type CreateFormEInput = {
  values: FormEValues
  submittedBy?: string
}

export async function createFormERecord({
  values,
  submittedBy,
}: CreateFormEInput) {
  return insertFormRecord(FORM_E_TABLE, {
    submitted_by: submittedBy ?? null,
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
}

export const formESupabaseInsertExample = `
insert into public.${FORM_E_TABLE} (
  submitted_by,
  linked_research,
  title_of_artistic_work,
  type_of_output,
  type_of_public_event
) values (
  '<user-id>',
  'Parent Research Project',
  'Sample Creative Work',
  'computer_software',
  'publication'
);
`.trim()
