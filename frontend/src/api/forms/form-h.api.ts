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
      extension_title: values.title,
      training_courses: values.trainingCourses === "yes",
      external_clients_technical: values.technicalAdvisoryService === "yes",
      information_dissemination: values.informationDissemination === "yes",
      external_clients_consultancy: values.consultancy === "yes",
      community_outreach: values.communityOutreach === "yes",
      knowledge_transfer: values.technologyTransfer === "yes",
      organizing: values.organizing === "yes",
      work_scope: values.scopeOfWork,
      start_date: toIsoDate(values.startDate),
      end_date: toIsoDate(values.endDate),
      target_beneficiary_group: values.targetBeneficiary,
      program_description: serializeFiles(values.programDocuments),
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
      academic_degree: emptyStringToNull(values.academicDegreePrograms),
      no_of_beneficiary_groups: toIntegerOrNull(values.numberOfBeneficiaries),
      majority_share_funding: values.fundingSource,
    })

  if (pbmsError) throw pbmsError

  return isipData
}