import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import {
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_K_TABLE = "form_k_other_accomplishments"

export type CreateFormKInput = {
  values: FormKOtherValues
  submittedBy?: string
}

export async function createFormKRecord({
  values,
  submittedBy,
}: CreateFormKInput) {
  return insertFormRecord(FORM_K_TABLE, {
    submitted_by: submittedBy ?? null,
    title: values.title,
    description: values.description,
    accomplishment_date: toIsoDate(values.date),
    supporting_documents: serializeFiles(values.supportingDocuments),
  })
}

export const formKSupabaseInsertExample = `
insert into public.${FORM_K_TABLE} (
  submitted_by,
  title,
  description,
  accomplishment_date
) values (
  '<user-id>',
  'Special Accomplishment',
  'Sample accomplishment description.',
  '2026-05-07T00:00:00.000Z'
);
`.trim()
