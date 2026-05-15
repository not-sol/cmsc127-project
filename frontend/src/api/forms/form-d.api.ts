// form-d.api.ts
import type { FormValues as FormDValues } from "@/features/forms/form-d/form-d-schema"
import { emptyStringToNull, serializeFiles, toIsoDate } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormDInput = {
  values: FormDValues
  reportId?: number
}

export async function createFormDRecord({ values, reportId }: CreateFormDInput) {
  // 1. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.patentTitle,
      author: values.aplInventors,
      report_id: reportId,
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 2. Insert into isip_patents_forms to get the entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_patents_forms")
    .insert({
      entry_id: entryId,
      attachments: serializeFiles(values.patentAttachments),
      remarks: emptyStringToNull(values.patentRemarks),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP patents entry:", isipError)
    throw isipError
  }

  // 3. Insert into pbms_patents_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_patents_forms")
    .insert({
      entry_id: entryId,
      linked_research: values.researchTitle3,
      patent_title: values.patentTitle,
      patent_type: values.patentType,
      application_no: Number(values.aplNum),        // numeric column — see note below
      inventor_name: values.aplInventors,            // singular column name
      applicant_name: values.aplApplicants,          // singular column name
      publication_date: toIsoDate(values.unexaminedApplicationDate),
      grant_date: values.grantPatentDate ? toIsoDate(values.grantPatentDate) : null,
      registration_no: values.regisNum ? Number(values.regisNum) : null,
      commercial_product_name: emptyStringToNull(values.commercialProduct),
      research_utilization_output: values.utilType,
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS patents entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId }
}