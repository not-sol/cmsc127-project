import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIntegerOrNull,
} from "@/api/forms/shared"

export const FORM_J_TABLE = "form_j_authorships"

export type CreateFormJInput = {
  values: FormJAuthorshipValues
  submittedBy?: string
}

export async function createFormJRecord({
  values,
  submittedBy,
}: CreateFormJInput) {
  return insertFormRecord(FORM_J_TABLE, {
    submitted_by: submittedBy ?? null,
    title_of_material: values.titleOfMaterial,
    authors: values.authors,
    year: toIntegerOrNull(values.year),
    attachments: serializeFiles(values.attachments),
    remarks: emptyStringToNull(values.remarks),
    related_kras: emptyStringToNull(values.relatedKRAs),
  })
}

export const formJSupabaseInsertExample = `
insert into public.${FORM_J_TABLE} (
  submitted_by,
  title_of_material,
  authors,
  year
) values (
  '<user-id>',
  'Laboratory Manual',
  'Dela Cruz, Juan',
  2026
);
`.trim()
