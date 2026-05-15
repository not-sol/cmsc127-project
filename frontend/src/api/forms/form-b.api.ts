// form-b.api.ts
import type { FormValues as FormBValues } from "@/features/forms/form-b/form-b-schema"
import { emptyStringToNull, serializeFiles, toIsoDate, toNumberOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormBInput = {
  values: FormBValues
  reportId?: number
}

export async function createFormBRecord({ values, reportId }: CreateFormBInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.researchTitle,
      author: values.researcherNames,
      report_id: reportId,
      // form_type_id: 2, // Research Grant
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_research_forms using the returned entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_research_forms")
    .insert({
      entry_id: entryId,
      research_title: values.researchTitle,
      research_type: values.researchType,
      start_date: toIsoDate(values.rStartDate),
      end_date: values.rEndDate ? toIsoDate(values.rEndDate) : null,
      researcher_name: values.researcherNames,        // singular column
      research_grant: toNumberOrNull(values.upSystemResearchGrantPesos) ?? 0,
      funding_amount: toNumberOrNull(values.externalFundingAmountPesos) ?? 0,
      total_funding: toNumberOrNull(values.totalFundingPesos) ?? 0,
      other_fund_source: emptyStringToNull(values.otherFundSource),
      attachments: serializeFiles(values.supportingAttachments),
      remarks: emptyStringToNull(values.researchRemarks),
      related_kras: emptyStringToNull(values.researchRelatedKRAs),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP research entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_research_forms using the same entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_research_forms")
    .insert({
      entry_id: entryId,
      contributing_unit: values.contrUnit,
      original_timeframe_months: toNumberOrNull(values.researchTimeframeMonths) ?? 0,
      majority_source_of_funds: values.majoritySource,
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS research entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}