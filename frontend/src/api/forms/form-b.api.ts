// form-b.api.ts
import type { FormValues as FormBValues } from "@/features/forms/form-b/form-b-schema"
import { emptyStringToNull, serializeFiles, toIsoDate, toNumberOrNull } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormBInput = {
  values: FormBValues
  userId: string
}

export async function createFormBRecord({ values, userId }: CreateFormBInput) {
  try {
    const { data, error } = await supabase
      .from("form_b_grants_and_fellowships")
      .insert({
        submitted_by: userId,
        contributing_unit: values.contrUnit,
        research_title: values.researchTitle,
        research_type: values.researchType,
        research_start_date: toIsoDate(values.rStartDate),
        research_end_date: values.rEndDate ? toIsoDate(values.rEndDate) : null,
        research_timeframe_months: values.researchTimeframeMonths,
        researcher_names: values.researcherNames,
        up_system_research_grant_pesos: toNumberOrNull(values.upSystemResearchGrantPesos) ?? 0,
        external_funding_amount_pesos: toNumberOrNull(values.externalFundingAmountPesos) ?? 0,
        total_funding_pesos: toNumberOrNull(values.totalFundingPesos) ?? 0,
        other_fund_source: emptyStringToNull(values.otherFundSource),
        majority_source: values.majoritySource,
        supporting_attachments: serializeFiles(values.supportingAttachments),
        remarks: emptyStringToNull(values.researchRemarks),
        related_kras: emptyStringToNull(values.researchRelatedKRAs),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormBRecord:", error)
    throw error
  }
}
