import type { FormGValues } from "@/features/forms/form-g/form-g-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIntegerOrNull,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_G_TABLE = "form_g_trainings"

export type CreateFormGInput = {
  values: FormGValues
  submittedBy?: string
}

export async function createFormGRecord({
  values,
  submittedBy,
}: CreateFormGInput) {
  return insertFormRecord(FORM_G_TABLE, {
    submitted_by: submittedBy ?? null,
    contributing_unit: values.contributingUnit,
    type_of_activity: values.typeOfActivity,
    title: values.title,
    venue: values.venue,
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
    attachments: serializeFiles(values.attachments),
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKras),
  })
}

export const formGSupabaseInsertExample = `
insert into public.${FORM_G_TABLE} (
  submitted_by,
  contributing_unit,
  type_of_activity,
  title,
  total_trainees
) values (
  '<user-id>',
  'CSMOD',
  'training',
  'Research Methods Workshop',
  30
);
`.trim()
