// form-h.api.ts
import type { FormHValues as FormHValues } from "@/features/forms/form-h/form-h-schema"
import { emptyStringToNull, logSupabaseError, toIntegerOrNull, toIsoDate, uploadFilesAsStoragePathText } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormHInput = {
  values: FormHValues
  reportId?: number
  submittedBy?: string
}

export async function createFormHRecord({ values, reportId: initialReportId }: CreateFormHInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Upload documents first. Store only Supabase Storage path text in the database.
  const programDocumentPaths = await uploadFilesAsStoragePathText(values.programDocuments, STORAGE_BUCKETS.FORM_H)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
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
    logSupabaseError("[Supabase] Failed to create base form entry", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_extension_programs_forms using the returned entry_id
  const isipPayload = {
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
    program_description: programDocumentPaths,
    remarks: emptyStringToNull(values.remarks),
  }

  console.log("[Supabase] Form H ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_extension_programs_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP extension programs entry", isipError)
    throw isipError
  }

  // 4. Insert into pbms_extension_programs_forms
  const pbmsPayload = {
    entry_id: entryId,
    contributing_unit: values.contributingUnit,
    academic_degree: emptyStringToNull(values.academicDegreePrograms),
    no_of_beneficiary_groups: toIntegerOrNull(values.numberOfBeneficiaries),
    majority_share_funding: values.fundingSource,
  }

  console.log("[Supabase] Form H PBMS payload:", pbmsPayload)

  const { error: pbmsError } = await supabase
    .from("pbms_extension_programs_forms")
    .insert(pbmsPayload)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to create PBMS extension programs entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormHRecord(entryId: number): Promise<FormHValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_extension_programs_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP extension programs entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_extension_programs_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS extension programs entry:", pbmsError)
    throw pbmsError
  }

  return {
    contributingUnit: pbmsData.contributing_unit,
    title: isipData.extension_title,
    trainingCourses: isipData.training_courses ? "yes" : "no",
    technicalAdvisoryService: isipData.external_clients_technical ? "yes" : "no",
    informationDissemination: isipData.information_dissemination ? "yes" : "no",
    consultancy: isipData.external_clients_consultancy ? "yes" : "no",
    communityOutreach: isipData.community_outreach ? "yes" : "no",
    technologyTransfer: isipData.knowledge_transfer ? "yes" : "no",
    organizing: isipData.organizing ? "yes" : "no",
    academicDegreePrograms: pbmsData.academic_degree || "",
    scopeOfWork: isipData.work_scope,
    startDate: new Date(isipData.start_date),
    endDate: new Date(isipData.end_date),
    targetBeneficiary: isipData.target_beneficiary_group,
    numberOfBeneficiaries: String(pbmsData.no_of_beneficiary_groups || 0),
    fundingSource: pbmsData.majority_share_funding,
    programDocuments: isipData.program_description, // String representation from storage
    remarks: isipData.remarks || "",
  }
}
