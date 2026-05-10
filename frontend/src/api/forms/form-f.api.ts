import type { FormFValues } from "@/features/forms/form-f/form-f-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  SupabaseInsertError,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_F_TABLE = "form_f_awards_and_grants"
const POSTGREST_SCHEMA_OUTDATED_CODE = "PGRST204"

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
      error instanceof SupabaseInsertError &&
      error.table === FORM_F_TABLE &&
      error.supabaseError.code === POSTGREST_SCHEMA_OUTDATED_CODE &&
      error.supabaseError.message.includes("submitted_by")
    ) {
      console.warn(
        `[supabase] ${FORM_F_TABLE}: retrying insert without submitted_by due to schema cache mismatch.`
      )

      try {
        return await insertFormRecord(FORM_F_TABLE, basePayload)
      } catch (retryError) {
        throw new Error(
          `Insert retry for "${FORM_F_TABLE}" without submitted_by also failed. ${
            retryError instanceof Error ? retryError.message : "Unknown retry failure."
          }`
        )
      }
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
