// form-b.api.ts
import type { FormValues as FormBValues } from "@/features/forms/form-b/form-b-schema"
import { emptyStringToNull, serializeFiles, toIsoDate, toNumberOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormBInput = {
  values: FormBValues
  entry_id?: string
}

export async function createFormBRecord({ values }: CreateFormBInput) {
  // 1. Insert into isip_research_forms to get the entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_research_forms")
    .insert({
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

  if (isipError) throw isipError

  // 2. Insert into pbms_research_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_research_forms")
    .insert({
      entry_id: isipData.entry_id,
      contributing_unit: values.contrUnit,
      original_timeframe_months: toNumberOrNull(values.researchTimeframeMonths) ?? 0,
      majority_source_of_funds: values.majoritySource,
    })

  if (pbmsError) throw pbmsError

  return isipData
}