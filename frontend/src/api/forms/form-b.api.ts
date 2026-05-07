import type { FormValues as FormBValues } from "@/features/forms/form-b/form-b-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
  toNumberOrNull,
} from "@/api/forms/shared"

export const FORM_B_TABLE = "form_b_grants_and_fellowships"

export type CreateFormBInput = {
  values: FormBValues
  submittedBy?: string
}

export async function createFormBRecord({
  values,
  submittedBy,
}: CreateFormBInput) {
  return insertFormRecord(FORM_B_TABLE, {
    submitted_by: submittedBy ?? null,
    contributing_unit: values.contrUnit,
    research_title: values.researchTitle,
    research_type: values.researchType,
    research_start_date: toIsoDate(values.rStartDate),
    research_end_date: toIsoDate(values.rEndDate),
    research_timeframe_months: emptyStringToNull(values.researchTimeframeMonths),
    researcher_names: values.researcherNames,
    up_system_research_grant_pesos: toNumberOrNull(values.upSystemResearchGrantPesos),
    external_funding_amount_pesos: toNumberOrNull(values.externalFundingAmountPesos),
    total_funding_pesos: toNumberOrNull(values.totalFundingPesos),
    other_fund_source: emptyStringToNull(values.otherFundSource),
    majority_source: values.majoritySource,
    supporting_attachments: serializeFiles(values.supportingAttachments),
    remarks: emptyStringToNull(values.researchRemarks),
    related_kras: emptyStringToNull(values.researchRelatedKRAs),
  })
}

export const formBSupabaseInsertExample = `
insert into public.${FORM_B_TABLE} (
  submitted_by,
  contributing_unit,
  research_title,
  research_type,
  total_funding_pesos
) values (
  '<user-id>',
  'csmod',
  'Sample Research Project',
  'basic',
  150000
);
`.trim()
