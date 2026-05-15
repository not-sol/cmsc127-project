// form-h.api.ts
import type { FormHValues as FormHValues } from "@/features/forms/form-h/form-h-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormHInput = {
  values: FormHValues
  submittedBy?: string
}

export async function createFormHRecord({ values, submittedBy }: CreateFormHInput) {
  // 0. Insert into forms table first to satisfy FK constraint
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.title,
      author: values.contributingUnit,
      description: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("Error creating forms record:", formError)
    throw formError
  }

  // 1. Insert into isip_extension_programs_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_extension_programs_forms")
    .insert({
      entry_id: formData.entry_id,
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

  if (isipError) {
    console.error("Error creating isip_extension_programs_forms record:", isipError)
    throw isipError
  }

  // 2. Insert into pbms_extension_programs_forms
  const { error: pbmsError } = await supabase
    .from("pbms_extension_programs_forms")
    .insert({
      entry_id: formData.entry_id,
      contributing_unit: values.contributingUnit,
      academic_degree: emptyStringToNull(values.academicDegreePrograms),
      no_of_beneficiary_groups: toIntegerOrNull(values.numberOfBeneficiaries),
      majority_share_funding: values.fundingSource,
    })

  if (pbmsError) {
    console.error("Error creating pbms_extension_programs_forms record:", pbmsError)
    throw pbmsError
  }

  return isipData
}