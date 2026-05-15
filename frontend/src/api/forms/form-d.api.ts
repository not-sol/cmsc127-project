// form-d.api.ts
import type { FormValues as FormDValues } from "@/features/forms/form-d/form-d-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormDInput = {
  values: FormDValues
  userId: string
}

export async function createFormDRecord({ values, userId }: CreateFormDInput) {
  try {
    const { data, error } = await supabase
      .from("form_d_patents")
      .insert({
        submitted_by: userId,
        linked_research_title: values.researchTitle3,
        patent_title: values.patentTitle,
        patent_type: values.patentType,
        application_number: values.aplNum,
        inventor_names: values.aplInventors,
        applicant_names: values.aplApplicants,
        unexamined_application_date: toIsoDate(values.unexaminedApplicationDate),
        grant_patent_date: values.grantPatentDate ? toIsoDate(values.grantPatentDate) : null,
        registration_number: values.regisNum,
        commercial_product_name: emptyStringToNull(values.commercialProduct),
        utilization_type: values.utilType,
        attachments: serializeFiles(values.patentAttachments),
        remarks: emptyStringToNull(values.patentRemarks),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormDRecord:", error)
    throw error
  }
}
