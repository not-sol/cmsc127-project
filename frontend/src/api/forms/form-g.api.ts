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
      activity_type: values.typeOfActivity,
      training_title: values.title,
      training_venue: values.venue,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      special_notes: emptyStringToNull(values.specialNotes),
      training_hours: toIntegerOrNull(values.trainingHours),
      total_trainees: toIntegerOrNull(values.totalTrainees),
      funding_source: values.fundingSource,
      sample_size: toIntegerOrNull(values.sampleSize),
      responses_poor: toIntegerOrNull(values.responsesPoor),
      responses_fair: toIntegerOrNull(values.responsesFair),
      responses_satisfactory: toIntegerOrNull(values.responsesSatisfactory),
      responses_very_satisfactory: toIntegerOrNull(values.responsesVerySatisfactory),
      responses_outstanding: toIntegerOrNull(values.responsesOutstanding),
      is_part_of_extension_program: values.isPartOfExtensionProgram === "yes",
      related_extension_program: emptyStringToNull(values.relatedExtensionProgram),
    })

  if (pbmsError) throw pbmsError

  return isipData
}