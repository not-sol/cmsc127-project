// form-d.api.ts
import type { FormValues as FormDValues } from "@/features/forms/form-d/form-d-schema"
import { createBaseFormEntry, emptyStringToNull, FORM_TYPE_NAMES, toIsoDate, uploadFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormDInput = {
  values: FormDValues
  reportId?: number
}

export async function createFormDRecord({ values, reportId: initialReportId }: CreateFormDInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Upload files first
  const attachmentPath = await uploadFiles(values.patentAttachments, STORAGE_BUCKETS.FORM_D)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.patentTitle,
    author: values.aplInventors,
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_D,
  })
  const entryId = formData.entry_id

  // 3. Insert into isip_patents_forms to get the entry_id
  const { error: isipError } = await supabase
    .from("isip_patents_forms")
    .insert({
      entry_id: entryId,
      attachments: attachmentPath || "",
      remarks: emptyStringToNull(values.patentRemarks),
    })
    .select("entry_id")
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP patents entry:", isipError)
    throw isipError
  }

  // 4. Insert into pbms_patents_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_patents_forms")
    .insert({
      entry_id: entryId,
      linked_research: values.researchTitle3,
      patent_title: values.patentTitle,
      patent_type: values.patentType,
      application_no: values.aplNum ? Number(values.aplNum) : null,
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

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormDRecord(entryId: number): Promise<FormDValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_patents_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP patents entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_patents_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS patents entry:", pbmsError)
    throw pbmsError
  }

  return {
    researchTitle3: pbmsData.linked_research,
    patentTitle: pbmsData.patent_title,
    patentType: pbmsData.patent_type,
    aplNum: String(pbmsData.application_no),
    aplInventors: pbmsData.inventor_name,
    aplApplicants: pbmsData.applicant_name,
    unexaminedApplicationDate: new Date(pbmsData.publication_date),
    grantPatentDate: pbmsData.grant_date ? new Date(pbmsData.grant_date) : undefined,
    regisNum: pbmsData.registration_no ? String(pbmsData.registration_no) : "",
    commercialProduct: pbmsData.commercial_product_name || "",
    utilType: pbmsData.research_utilization_output,
    patentAttachments: isipData.attachments,
    patentRemarks: isipData.remarks || "",
  }
}

