// form-i.api.ts
import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormIInput = {
  values: FormIPartnershipValues
  reportId?: number
}

export async function createFormIRecord({ values, reportId }: CreateFormIInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titleOfExtensionPartnership,
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

  // 2. Insert into isip_partnerships_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_partnerships_forms")
    .insert({
      entry_id: entryId,
      partnership_title: values.titleOfExtensionPartnership,
      work_scope: values.scopeOfWork,
      training_courses: values.trainingCourses === "yes",
      advisory_service: values.technicalAdvisoryService === "yes",
      information_dissemination: values.informationDissemination === "yes",
      consultancy: values.consultancy === "yes",
      community_outreach: values.communityOutreach === "yes",
      knowledge_transfer: values.technologyKnowledgeTransfer === "yes",
      organizing_events: values.organizingEvents === "yes",
      remarks: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP partnership entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_partnerships_forms using the same entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_partnerships_forms")
    .insert({
      entry_id: entryId,
      contributing_unit: values.contributingUnit,
      partner_stakeholder_name: values.nameOfPartnerStakeholder,
      stakeholder_category: values.stakeholderCategory,
      partnership_agreement_type: values.typeOfPartnershipAgreement,
      partnership_effectivity_start_date: toIsoDate(values.partnershipEffectivityStartDate),
      partnership_effectivity_end_date: toIsoDate(values.partnershipEffectivityEndDate),
      moa_docs: serializeFiles(values.moaDocument),
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS partnership entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}