import type { FormValues as FormAValues } from "@/features/forms/form-a/form-a-schema"
import {
  emptyStringToNull,
  insertFormRecord,
  serializeFiles,
} from "@/api/forms/shared"

export const FORM_A_TABLE = "form_a_publications"

export type CreateFormAInput = {
  values: FormAValues
  submittedBy?: string
}

export async function createFormARecord({
  values,
  submittedBy,
}: CreateFormAInput) {
  return insertFormRecord(FORM_A_TABLE, {
    submitted_by: submittedBy ?? null,
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
    doi_url: emptyStringToNull(values.doiUrl),
    isbn_issn: emptyStringToNull(values.isbn),
    is_isi: values.isIsi === "Yes",
    is_scopus: values.scopus === "Yes",
    is_pubmed_medline: values.pubmedMedline === "Yes",
    is_ched_recognized: values.isChedRecognized === "Yes",
    is_peer_reviewed: values.peerRev === "Yes",
    other_database: emptyStringToNull(values.otherDB),
    citation_count: emptyStringToNull(values.citationNum),
    proof_of_publication_files: serializeFiles(values.pubProof),
    proof_of_utilization_files: serializeFiles(values.pubUtilProof),
    remarks: emptyStringToNull(values.pubSupRemarks),
    related_kras: emptyStringToNull(values.pubRelatedKRAs),
  })
}

export const formASupabaseInsertExample = `
insert into public.${FORM_A_TABLE} (
  submitted_by,
  publication_type,
  publication_title,
  publication_authors,
  publication_date
) values (
  '<user-id>',
  'journalArticle',
  'Sample Publication Title',
  'Dela Cruz, Juan',
  '2026'
);
`.trim()
