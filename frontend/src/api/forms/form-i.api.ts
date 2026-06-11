// form-i.api.ts
import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import {
  createBaseFormEntry,
  createSupportingDocuments,
  emptyStringToNull,
  FORM_TYPE_NAMES,
  getSupportingDocuments,
  logSupabaseError,
  supportingDocumentsToFieldValue,
  toIsoDate,
} from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormIInput = {
  values: FormIPartnershipValues
  reportId?: number
  submittedBy?: string
  existingMoaDocumentPath?: string | null
}

function getMoaDocumentInputType(value: unknown) {
  if (value instanceof File) return "File"
  if (Array.isArray(value)) return "File[]"
  if (typeof FileList !== "undefined" && value instanceof FileList) return "FileList"
  if (typeof value === "string") return "string"
  if (value === null) return "null"
  return typeof value
}

function assertSingleMoaDocument(value: unknown) {
  const inputType = getMoaDocumentInputType(value)
  console.log("[Form I API] moaDocument input type:", inputType)

  if (Array.isArray(value) || (typeof FileList !== "undefined" && value instanceof FileList)) {
    console.error("[Form I API] Validation schema mismatch: Form I expects a single File, not File[].")
    throw new Error("Form I accepts exactly one signed agreement PDF. Please remove extra files and submit one PDF.")
  }

  if (value instanceof File && value.type !== "application/pdf") {
    throw new Error("Form I accepts PDF files only.")
  }

  if (!(value instanceof File) && typeof value !== "string") {
    throw new Error("Please upload one signed MOA / MOU / Partnership Agreement PDF.")
  }
}

export async function createFormIRecord({ values, reportId: initialReportId, existingMoaDocumentPath }: CreateFormIInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Validate the single PDF input.
  assertSingleMoaDocument(values.moaDocument)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
  const formData = await createBaseFormEntry({
    title: values.titleOfExtensionPartnership,
    author: "",
    reportId,
    formTypeName: FORM_TYPE_NAMES.FORM_I,
  })
  const entryId = formData.entry_id

  await createSupportingDocuments({
    entryId,
    value: values.moaDocument || existingMoaDocumentPath,
    bucket: STORAGE_BUCKETS.FORM_I,
    documentType: "partnership_agreement",
    required: true,
  })

  // 3. Insert into isip_partnership_forms using the returned entry_id.
  const isipPayload = {
    entry_id: entryId,
    partnership_title: values.titleOfExtensionPartnership,
    training_courses: values.trainingCourses,
    advisory_service: values.technicalAdvisoryService,
    information_dissemination: values.informationDissemination,
    consultancy: values.consultancy,
    community_outreach: values.communityOutreach,
    knowledge_transfer: values.technologyKnowledgeTransfer,
    organizing_events: values.organizingEvents,
    remarks: emptyStringToNull(values.remarks),
  }

  console.log("[Supabase] Form I ISIP payload:", isipPayload)

  const { error: isipError } = await supabase
    .from("isip_partnership_forms")
    .insert(isipPayload)

  if (isipError) {
    logSupabaseError("[Supabase] Failed to create ISIP partnership entry", isipError)
    throw isipError
  }

  // 4. Insert into pbms_partnerships_forms using the same entry_id.
  const pbmsPayload = {
    entry_id: entryId,
    contributing_unit: values.contributingUnit,
    partner_stakeholder_name: values.nameOfPartnerStakeholder,
    stakeholder_category: values.stakeholderCategory,
    partnership_agreement_type: values.typeOfPartnershipAgreement,
    partnership_effectivity_start_date: toIsoDate(values.partnershipEffectivityStartDate),
    partnership_effectivity_end_date: toIsoDate(values.partnershipEffectivityEndDate),
  }

  console.log("[Supabase] Form I PBMS payload:", pbmsPayload)

  const { error: pbmsError } = await supabase
    .from("pbms_partnerships_forms")
    .insert(pbmsPayload)

  if (pbmsError) {
    logSupabaseError("[Supabase] Failed to create PBMS partnership entry", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormIRecord(entryId: number): Promise<FormIPartnershipValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_partnership_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP partnership entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_partnerships_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS partnership entry:", pbmsError)
    throw pbmsError
  }

  const moaDocuments = await getSupportingDocuments(entryId, "partnership_agreement")

  return {
    contributingUnit: pbmsData.contributing_unit,
    titleOfExtensionPartnership: isipData.partnership_title,
    scopeOfWork: "", // Default to empty as it's not explicitly in these tables
    nameOfPartnerStakeholder: pbmsData.partner_stakeholder_name,
    stakeholderCategory: pbmsData.stakeholder_category,
    trainingCourses: isipData.training_courses ? "yes" : "no",
    technicalAdvisoryService: isipData.advisory_service ? "yes" : "no",
    informationDissemination: isipData.information_dissemination ? "yes" : "no",
    consultancy: isipData.consultancy ? "yes" : "no",
    communityOutreach: isipData.community_outreach ? "yes" : "no",
    technologyKnowledgeTransfer: isipData.knowledge_transfer ? "yes" : "no",
    organizingEvents: isipData.organizing_events ? "yes" : "no",
    typeOfPartnershipAgreement: pbmsData.partnership_agreement_type,
    partnershipEffectivityStartDate: new Date(pbmsData.partnership_effectivity_start_date),
    partnershipEffectivityEndDate: new Date(pbmsData.partnership_effectivity_end_date),
    moaDocument: supportingDocumentsToFieldValue(moaDocuments) as unknown as FormIPartnershipValues["moaDocument"],
    remarks: isipData.remarks || "",
  }
}
