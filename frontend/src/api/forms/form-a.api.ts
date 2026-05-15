// form-a.api.ts
import type { FormValues as FormAValues } from "@/features/forms/form-a/form-a-schema"
import { emptyStringToNull, uploadFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client" // your supabase client

export type CreateFormAInput = {
  values: FormAValues
  entry_id?: string
}

function toSqlDate(val: string): string {
  // If year-only (e.g. "2024"), convert to "2024-01-01"
  if (/^\d{4}$/.test(val.trim())) return `${val.trim()}-01-01`
  // Otherwise assume it's already MM/DD/YYYY from your Zod transform
  const [mm, dd, yyyy] = val.split("/")
  return `${yyyy}-${mm}-${dd}`
}

export async function createFormARecord({ values }: CreateFormAInput) {
  // 1. Upload files first
  const pubProofPath = await uploadFiles(values.pubProof, "publication_proof")
  const utilProofPath = await uploadFiles(values.pubUtilProof, "publication_proof")

  // 2. Insert into isip_publication_forms first to get the entry_id
  const { data: isipData, error: isipError } = await supabase
    .from("isip_publication_forms")
    .insert({
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
    .select("entry_id")
    .single()

  if (isipError) throw isipError

  // 3. Insert into pbms_publication_forms using the returned entry_id
  const { error: pbmsError } = await supabase
    .from("pbms_publication_forms")
    .insert({
      entry_id: isipData.entry_id,
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

  if (pbmsError) throw pbmsError

  return isipData
}