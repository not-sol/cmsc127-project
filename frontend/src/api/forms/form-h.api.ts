// form-h.api.ts
import type { FormHValues as FormHValues } from "@/features/forms/form-h/form-h-schema"
import { emptyStringToNull, serializeFiles, toIntegerOrNull, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormHInput = {
  values: FormHValues
  reportId?: number
}

export async function createFormHRecord({ values, reportId }: CreateFormHInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.title,
      author: "",
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_extension_programs_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_extension_programs_forms")
    .insert({
      entry_id: entryId,
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
    console.error("[Supabase] Failed to create ISIP extension programs entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_extension_programs_forms
  const { error: pbmsError } = await supabase
    .from("pbms_extension_programs_forms")
    .insert({
      entry_id: entryId,
      contributing_unit: values.contributingUnit,
      academic_degree: emptyStringToNull(values.academicDegreePrograms),
      no_of_beneficiary_groups: toIntegerOrNull(values.numberOfBeneficiaries),
      majority_share_funding: values.fundingSource,
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS extension programs entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}