import type { FormValues as FormCValues } from "@/features/forms/form-c/form-c-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_C_TABLE = "form_c_presentations"

export type CreateFormCInput = {
  values: FormCValues
  submittedBy?: string
}

export async function createFormCRecord({
  values,
  submittedBy,
}: CreateFormCInput) {
  return insertFormRecord(FORM_C_TABLE, {
    submitted_by: submittedBy ?? null,
    linked_research_title: values.researchTitle2,
    presented_title: values.titlePresented,
    presentation_type: values.presentationType,
    event_type: values.eventType,
    event_title: values.eventTitle,
    organizer_name: values.organizerName,
    conference_location: values.conferenceLocation,
    conference_address: values.conferenceAddress,
    conference_start_date: toIsoDate(values.conferenceStartDate),
    conference_end_date: toIsoDate(values.conferenceEndDate),
    presentation_date: toIsoDate(values.presentationDate),
    attachments: serializeFiles(values.presentationAttachments),
    remarks: emptyStringToNull(values.presentationRemarks),
    related_kras: emptyStringToNull(values.presentationRelatedKRAs),
  })
}

export const formCSupabaseInsertExample = `
insert into public.${FORM_C_TABLE} (
  submitted_by,
  linked_research_title,
  presented_title,
  presentation_type,
  event_title
) values (
  '<user-id>',
  'Parent Research Project',
  'Sample Paper Presentation',
  'oral',
  'National Research Conference'
);
`.trim()
