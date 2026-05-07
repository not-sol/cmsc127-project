import type { FormValues as FormDValues } from "@/features/forms/form-d/form-d-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_D_TABLE = "form_d_patents"

export type CreateFormDInput = {
  values: FormDValues
  submittedBy?: string
}

export async function createFormDRecord({
  values,
  submittedBy,
}: CreateFormDInput) {
  return insertFormRecord(FORM_D_TABLE, {
    submitted_by: submittedBy ?? null,
    linked_research_title: values.researchTitle3,
    patent_title: values.patentTitle,
    patent_type: values.patentType,
    application_number: values.aplNum,
    inventor_names: values.aplInventors,
    applicant_names: values.aplApplicants,
    unexamined_application_date: toIsoDate(values.unexaminedApplicationDate),
    grant_patent_date: toIsoDate(values.grantPatentDate),
    registration_number: emptyStringToNull(values.regisNum),
    commercial_product_name: emptyStringToNull(values.commercialProduct),
    utilization_type: values.utilType,
    attachments: serializeFiles(values.patentAttachments),
    remarks: emptyStringToNull(values.patentRemarks),
  })
}

export const formDSupabaseInsertExample = `
insert into public.${FORM_D_TABLE} (
  submitted_by,
  linked_research_title,
  patent_title,
  patent_type,
  application_number
) values (
  '<user-id>',
  'Parent Research Project',
  'Sample Patent',
  'invention',
  'APP-2026-0001'
);
`.trim()
