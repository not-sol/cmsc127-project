// form-i.api.ts
import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormIInput = {
  values: FormIPartnershipValues
  entry_id?: string
}

export async function createFormIRecord({ values }: CreateFormIInput) {
  // 1. Insert into isip_partnerships_forms
  const { data: isipData, error: isipError } = await supabase
    .from("isip_partnerships_forms")
    .insert({
      remarks: emptyStringToNull(values.remarks),
    })
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 2. Insert into pbms_partnerships_forms
  const { error: pbmsError } = await supabase
    .from("pbms_partnerships_forms")
    .insert({
      entry_id: isipData.entry_id,
      contributing_unit: values.contributingUnit,
      partnership_title: values.titleOfExtensionPartnership,
      work_scope: values.scopeOfWork,
      stakeholder_name: values.nameOfPartnerStakeholder,
      stakeholder_category: values.stakeholderCategory,
      has_training_courses: values.trainingCourses === "yes",
      has_technical_advisory: values.technicalAdvisoryService === "yes",
      has_info_dissemination: values.informationDissemination === "yes",
      has_consultancy: values.consultancy === "yes",
      has_community_outreach: values.communityOutreach === "yes",
      has_tech_transfer: values.technologyKnowledgeTransfer === "yes",
      has_organizing_events: values.organizingEvents === "yes",
      agreement_type: values.typeOfPartnershipAgreement,
      start_date: toIsoDate(values.partnershipEffectivityStartDate),
      end_date: toIsoDate(values.partnershipEffectivityEndDate),
      moa_docs: serializeFiles(values.moaDocument),
    })

  if (pbmsError) throw pbmsError

  return isipData
}