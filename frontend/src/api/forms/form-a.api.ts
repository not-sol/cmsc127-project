// form-a.api.ts
import type { FormValues as FormAValues } from "@/features/forms/form-a/form-a-schema"
import { emptyStringToNull, uploadFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"
import { STORAGE_BUCKETS } from "@/lib/storage-constants"
import { getOrCreateDraftReportId } from "@/api/reports"

export type CreateFormAInput = {
  values: FormAValues
  reportId?: number
}

function toSqlDate(val: string): string {
  // If year-only (e.g. "2024"), convert to "2024-01-01"
  if (/^\d{4}$/.test(val.trim())) return `${val.trim()}-01-01`
  // Otherwise assume it's already MM/DD/YYYY from your Zod transform
  const [mm, dd, yyyy] = val.split("/")
  return `${yyyy}-${mm}-${dd}`
}

function fromSqlDate(sqlDate: string): string {
  if (!sqlDate) return ""
  // If it's YYYY-MM-DD, convert to MM/DD/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(sqlDate)) {
    const [yyyy, mm, dd] = sqlDate.split("-")
    return `${mm}/${dd}/${yyyy}`
  }
  return sqlDate
}

export async function createFormARecord({ values, reportId: initialReportId }: CreateFormAInput) {
  // 0. Get an existing report id, or lazily create a draft during form submission
  const reportId = await getOrCreateDraftReportId(initialReportId)

  // 1. Upload files first
  const pubProofPath = await uploadFiles(values.pubProof, STORAGE_BUCKETS.FORM_A)
  const utilProofPath = await uploadFiles(values.pubUtilProof, STORAGE_BUCKETS.FORM_A)

  // 2. Insert into the base 'forms' table first to get a valid entry_id
  const { data: formData, error: formError } = await supabase
    .from("forms")
    .insert({
      title: values.pubTitle,
      author: values.pubAuthors,
      report_id: reportId,
      // form_type_id: 1, // Optional: Publication
    })
    .select("entry_id")
    .single()

  if (formError) {
    console.error("[Supabase] Failed to create base form entry:", formError)
    throw formError
  }

  const entryId = formData.entry_id

  // 3. Insert into isip_publication_forms using the returned entry_id
  const { error: isipError } = await supabase
    .from("isip_publication_forms")
    .insert({
      entry_id: entryId,
      publication_type: values.pubType,
      publication_title: values.pubTitle,
      publication_author: values.pubAuthors,         // singular column name
      publication_date_published: toSqlDate(values.pubDate),
      publication_name: values.pubName,
      isi: values.isIsi === "Yes",
      scopus: values.scopus === "Yes",
      pubmed: values.pubmedMedline === "Yes",
      ched_recognized: values.isChedRecognized === "Yes",
      peer_reviewed: values.peerRev === "Yes",
      other_reputable_database: emptyStringToNull(values.otherDB),
      publication_proof: pubProofPath || "", // NOT NULL in schema
      remarks: emptyStringToNull(values.pubSupRemarks),
      related_kras: emptyStringToNull(values.pubRelatedKRAs),
    })

  if (isipError) {
    console.error("[Supabase] Failed to create ISIP publication entry:", isipError)
    throw isipError
  }

  // 4. Insert into pbms_publication_forms using the same entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_publication_forms")
    .insert({
      entry_id: entryId,
      publisher_name: values.pubrName,
      publisher_type: values.pubrType,
      publisher_location: values.pubrLocr,
      editor_name: emptyStringToNull(values.edrName),
      volume_issue_no: emptyStringToNull(values.vonumInum),
      doi: values.doiUrl || "",           // NOT NULL
      isbn: emptyStringToNull(values.isbn),
      number_of_citation: values.citationNum ? Number(values.citationNum) : null,
      utilization_proof: utilProofPath,
    })

  if (pbmsError) {
    console.error("[Supabase] Failed to create PBMS publication entry:", pbmsError)
    throw pbmsError
  }

  return { entry_id: entryId, report_id: reportId }
}

export async function getFormARecord(entryId: number): Promise<FormAValues> {
  const { data: isipData, error: isipError } = await supabase
    .from("isip_publication_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (isipError) {
    console.error("[Supabase] Failed to fetch ISIP publication entry:", isipError)
    throw isipError
  }

  const { data: pbmsData, error: pbmsError } = await supabase
    .from("pbms_publication_forms")
    .select("*")
    .eq("entry_id", entryId)
    .single()

  if (pbmsError) {
    console.error("[Supabase] Failed to fetch PBMS publication entry:", pbmsError)
    throw pbmsError
  }

  return {
    pubType: isipData.publication_type,
    pubTitle: isipData.publication_title,
    pubAuthors: isipData.publication_author,
    pubDate: fromSqlDate(isipData.publication_date_published),
    pubName: isipData.publication_name,
    isIsi: isipData.isi ? "Yes" : "No",
    scopus: isipData.scopus ? "Yes" : "No",
    pubmedMedline: isipData.pubmed ? "Yes" : "No",
    isChedRecognized: isipData.ched_recognized ? "Yes" : "No",
    peerRev: isipData.peer_reviewed ? "Yes" : "No",
    otherDB: isipData.other_reputable_database || "",
    pubProof: isipData.publication_proof,
    pubSupRemarks: isipData.remarks || "",
    pubRelatedKRAs: isipData.related_kras || "",

    pubrName: pbmsData.publisher_name,
    pubrType: pbmsData.publisher_type,
    pubrLocr: pbmsData.publisher_location,
    edrName: pbmsData.editor_name || "",
    vonumInum: pbmsData.volume_issue_no || "",
    doiUrl: pbmsData.doi || "",
    isbn: pbmsData.isbn || "",
    citationNum: String(pbmsData.number_of_citation || 0),
    pubUtilProof: pbmsData.utilization_proof,
    otherPubTypeText: "", // Not stored in DB currently or derived from pubType
  }
}
