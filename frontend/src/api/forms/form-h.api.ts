// form-h.api.ts
import type { FormHValues as FormHValues } from "@/features/forms/form-h/form-h-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormHInput = {
  values: FormHValues
  entry_id?: string
}

export async function createFormHRecord({ values }: CreateFormHInput) {
  // 1. Insert into isip_extension_programs_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_extension_programs_forms")
    .insert({
      remarks: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_extension_programs_forms
  const { error: pbmsError } = await supabase
    .from("pbms_extension_programs_forms")
    .insert({
      entry_id: isipData.entry_id,
      contributing_unit: values.contributingUnit,
      extension_title: values.title,
      has_training_courses: values.trainingCourses === "yes",
      has_technical_advisory: values.technicalAdvisoryService === "yes",
      has_info_dissemination: values.informationDissemination === "yes",
      has_consultancy: values.consultancy === "yes",
      has_community_outreach: values.communityOutreach === "yes",
      has_tech_transfer: values.technologyTransfer === "yes",
      has_organizing: values.organizing === "yes",
      academic_programs: emptyStringToNull(values.academicDegreePrograms),
      work_scope: values.scopeOfWork,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      beneficiary_name: values.targetBeneficiary,
      beneficiary_count: toIntegerOrNull(values.numberOfBeneficiaries),
      funding_source: values.fundingSource,
      program_docs: serializeFiles(values.programDocuments),
    })

  if (pbmsError) throw pbmsError

  return isipData
}