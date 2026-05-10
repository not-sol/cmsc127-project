import type { FormFValues } from "@/features/forms/form-f/form-f-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_F_TABLE = "form_f_awards_and_grants"

export type CreateFormFInput = {
  values: FormFValues
  submittedBy?: string
}

export async function createFormFRecord({
  values,
  submittedBy,
}: CreateFormFInput) {
  const basePayload = {
    type: values.type,
    award_grant_title: values.awardGrantTitle,
    source_awarding_body: values.sourceAwardingBody,
    details: values.details,
    start_date: toIsoDate(values.startDate),
    end_date: toIsoDate(values.endDate),
    attachments: serializeFiles(values.attachments),
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKras),
  }

  try {
    return await insertFormRecord(FORM_F_TABLE, {
      ...basePayload,
      ...(submittedBy ? { submitted_by: submittedBy } : {}),
    })
  } catch (error) {
    if (
      submittedBy &&
      error instanceof Error &&
      error.message.includes("'submitted_by'") &&
      error.message.includes("schema cache")
    ) {
      console.warn(
        `[supabase] ${FORM_F_TABLE}: retrying insert without submitted_by due to schema cache mismatch.`
      )
      return insertFormRecord(FORM_F_TABLE, basePayload)
    }

    throw error
  }
}

export const formFSupabaseInsertExample = `
insert into public.${FORM_F_TABLE} (
  submitted_by,
  type,
  award_grant_title,
  source_awarding_body,
  details
) values (
  '<user-id>',
  'national',
  'Best Extension Program',
  'CHED',
  'Awarded for outstanding program implementation.'
);
`.trim()
