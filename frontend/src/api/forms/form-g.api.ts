// form-g.api.ts
import type { FormGValues as FormGValues } from "@/features/forms/form-g/form-g-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormGInput = {
  values: FormGValues
  entry_id?: string
}

export async function createFormGRecord({ values }: CreateFormGInput) {
  // 1. Insert into isip_trainings_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_trainings_forms")
    .insert({
      activity_type: values.typeOfActivity,
      training_title: values.title,
      venue: values.venue,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      attachments: serializeFiles(values.attachments),
      remarks: emptyStringToNull(values.remarks),
      related_kras: emptyStringToNull(values.relatedKras),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_trainings_forms
  const { error: pbmsError } = await supabase
    .from("pbms_trainings_forms")
    .insert({
      entry_id: isipData.entry_id,
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
      part_extension_program: values.isPartOfExtensionProgram === "yes",
      related_extension_program_title: emptyStringToNull(values.relatedExtensionProgram),
    })

  if (pbmsError) throw pbmsError

  return isipData
}