// form-a.api.ts
import type { FormValues as FormAValues } from "@/features/forms/form-a/form-a-schema"
import { emptyStringToNull, serializeFiles } from "@/api/forms/shared"
import { supabase } from "@/lib/supabase/client"

export type CreateFormAInput = {
  values: FormAValues
  userId: string
}

export async function createFormARecord({ values, userId }: CreateFormAInput) {
  try {
    const { data, error } = await supabase
      .from("form_a_publications")
      .insert({
        submitted_by: userId,
        publication_type: values.pubType,
        other_publication_type_text: emptyStringToNull(values.otherPubTypeText),
        publication_title: values.pubTitle,
        publication_authors: values.pubAuthors,
        publication_date: values.pubDate,
        publication_name: values.pubName,
        publisher_name: values.pubrName,
        publisher_type: values.pubrType,
        publisher_location: values.pubrLocr,
        editor_names: emptyStringToNull(values.edrName),
        volume_issue: emptyStringToNull(values.vonumInum),
        doi_url: values.doiUrl || null,
        isbn_issn: emptyStringToNull(values.isbn),
        is_isi: values.isIsi === "Yes",
        is_scopus: values.scopus === "Yes",
        is_pubmed_medline: values.pubmedMedline === "Yes",
        is_ched_recognized: values.isChedRecognized === "Yes",
        is_peer_reviewed: values.peerRev === "Yes",
        other_database: emptyStringToNull(values.otherDB),
        citation_count: emptyStringToNull(values.citationNum),
        proof_of_publication_files: serializeFiles(values.pubProof),
        proof_of_utilization_files: serializeFiles(values.pubUtilProof) ?? [],
        remarks: emptyStringToNull(values.pubSupRemarks),
        related_kras: emptyStringToNull(values.pubRelatedKRAs),
      })
      .select("id")
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createFormARecord:", error)
    throw error
  }
}
