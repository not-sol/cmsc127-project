import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_I_TABLE = "form_i_partnerships"

export type CreateFormIInput = {
  values: FormIPartnershipValues
  submittedBy?: string
}

export async function createFormIRecord({
  values,
  submittedBy,
}: CreateFormIInput) {
  return insertFormRecord(FORM_I_TABLE, {
    submitted_by: submittedBy ?? null,
    contributing_unit: values.contributingUnit,
    title_of_extension_partnership: values.titleOfExtensionPartnership,
    scope_of_work: values.scopeOfWork,
    partner_stakeholder_name: values.nameOfPartnerStakeholder,
    stakeholder_category: values.stakeholderCategory,
    training_courses: values.trainingCourses === "yes",
    technical_advisory_service: values.technicalAdvisoryService === "yes",
    information_dissemination: values.informationDissemination === "yes",
    consultancy: values.consultancy === "yes",
    community_outreach: values.communityOutreach === "yes",
    technology_knowledge_transfer: values.technologyKnowledgeTransfer === "yes",
    organizing_events: values.organizingEvents === "yes",
    type_of_partnership_agreement: values.typeOfPartnershipAgreement,
    partnership_effectivity_start_date: toIsoDate(values.partnershipEffectivityStartDate),
    partnership_effectivity_end_date: toIsoDate(values.partnershipEffectivityEndDate),
    moa_document: serializeFiles(values.moaDocument),
    remarks: emptyStringToNull(values.remarks),
  })
}

export const formISupabaseInsertExample = `
insert into public.${FORM_I_TABLE} (
  submitted_by,
  contributing_unit,
  title_of_extension_partnership,
  partner_stakeholder_name,
  type_of_partnership_agreement
) values (
  '<user-id>',
  'CSMOD',
  'Sample Extension Partnership',
  'Quezon City LGU',
  'MOA'
);
`.trim()
