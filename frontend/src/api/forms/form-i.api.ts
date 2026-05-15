// form-i.api.ts
import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormIInput = {
  values: FormIPartnershipValues
  submittedBy?: string
}

export async function createFormIRecord({ values, submittedBy }: CreateFormIInput) {
  // 0. Insert into forms table first to satisfy FK constraint
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.titleOfExtensionPartnership,
      author: values.nameOfPartnerStakeholder,
      description: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("Error creating forms record:", formError)
    throw formError
  }

  // 1. Insert into isip_partnership_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_partnership_forms")
    .insert({
      entry_id: formData.entry_id,
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
    console.error("Error creating isip_partnership_forms record:", isipError)
    throw isipError
  }

  // 2. Insert into pbms_partnerships_forms
  const { error: pbmsError } = await supabase
    .from("pbms_partnerships_forms")
    .insert({
      entry_id: formData.entry_id,
      contributing_unit: values.contributingUnit,
      partner_stakeholder_name: values.nameOfPartnerStakeholder,
      stakeholder_category: values.stakeholderCategory,
      partnership_agreement_type: values.typeOfPartnershipAgreement,
      partnership_effectivity_start_date: toIsoDate(values.partnershipEffectivityStartDate),
      partnership_effectivity_end_date: toIsoDate(values.partnershipEffectivityEndDate),
      moa_docs: serializeFiles(values.moaDocument),
    })

  if (pbmsError) {
    console.error("Error creating pbms_partnerships_forms record:", pbmsError)
    throw pbmsError
  }

  return isipData
}