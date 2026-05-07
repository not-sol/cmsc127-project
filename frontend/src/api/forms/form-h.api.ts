import type { FormHValues } from "@/features/forms/form-h/form-h-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
  toIntegerOrNull,
  toIsoDate,
} from "@/api/forms/shared"

export const FORM_H_TABLE = "form_h_extension_programs"

export type CreateFormHInput = {
  values: FormHValues
  submittedBy?: string
}

export async function createFormHRecord({
  values,
  submittedBy,
}: CreateFormHInput) {
  return insertFormRecord(FORM_H_TABLE, {
    submitted_by: submittedBy ?? null,
    contributing_unit: values.contributingUnit,
    title: values.title,
    training_courses: values.trainingCourses === "yes",
    technical_advisory_service: values.technicalAdvisoryService === "yes",
    information_dissemination: values.informationDissemination === "yes",
    consultancy: values.consultancy === "yes",
    community_outreach: values.communityOutreach === "yes",
    technology_transfer: values.technologyTransfer === "yes",
    organizing: values.organizing === "yes",
    academic_degree_programs: emptyStringToNull(values.academicDegreePrograms),
    scope_of_work: values.scopeOfWork,
    start_date: toIsoDate(values.startDate),
    end_date: toIsoDate(values.endDate),
    target_beneficiary: values.targetBeneficiary,
    number_of_beneficiaries: toIntegerOrNull(values.numberOfBeneficiaries),
    funding_source: values.fundingSource,
    program_documents: serializeFiles(values.programDocuments),
    remarks: emptyStringToNull(values.remarks),
  })
}

export const formHSupabaseInsertExample = `
insert into public.${FORM_H_TABLE} (
  submitted_by,
  contributing_unit,
  title,
  scope_of_work,
  number_of_beneficiaries
) values (
  '<user-id>',
  'CSMOD',
  'Community Extension Program',
  'Integrated extension activities for partner communities.',
  150
);
`.trim()
