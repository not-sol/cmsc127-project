import type { FormValues } from "@/features/forms/form-a/form-a-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFields: FormFieldConfig<FormValues>[] = [
  // SECTION A.1
  {
    type: "radio",
    name: "pubType",
    label: "Publication Type",
    options: [
      { value: "book", label: "Book" },
      { value: "bookChapter", label: "Book Chapter" },
      { value: "journalArticle", label: "Journal Article" },
      { value: "peerReviewed", label: "Peer-Reviewed" },
      { value: "conferencePaper", label: "Conference Paper" },

    ],
    otherOption: {
      name: "otherPubTypeText",
      value: "other",
      placeholder: "Enter publication type",
    }, //otherPubTypeText
  }, //pubType
  {
    type: "text",
    name: "pubTitle",
    label: "Title of Publication",
    placeholder: "Full title of the work",
  }, //pubTitle
  {
    type: "text",
    name: "pubAuthors",
    label: "Author/s",
    placeholder: "Separate multiple authors with semicolons; list lead author first",
  }, //pubAuthors
  {
    type: "text",
    name: "pubDate",
    label: "Date / Year Published",
    placeholder: "YYYY or MM/DD/YYYY if known",
  },
  // {
  //   type: "date-picker",
  //   name: "datePublished",
  //   label: "Date Published",
  // }, //datePublished

  // SECTION A.2
  {
    type: "text",
    name: "pubName",
    label: "Name of Journal / Book / Publication",
    placeholder: "Enter name",
  }, //pubName
  {
    type: "text",
    name: "pubrName",
    label: "Name of Publisher",
    placeholder: "Enter name",
  }, //pubrName
  {
    type: "radio",
    name: "pubrType",
    label: "Type of Publisher",
    options: [
      { value: "Commercial", label: "Commercial" },
      { value: "Learned Society / Association", label: "Learned Society / Association" },
      { value: "University Press", label: "University Press" },
    ],
  }, //pubrType
  {
    type: "radio",
    name: "pubrLocr",
    label: "Location of Publisher",
    options: [
      { value: "Local", label: "Local" },
      { value: "International", label: "International" },
    ],
  }, //pubrLocr
  {
    type: "text",
    name: "edrName",
    label: "Name of Editor(s)",
    placeholder: "If applicable",
  }, //pubrName
  {
    type: "text",
    name: "vonumInum",
    label: "Volume No. and Issue No.",
    placeholder: "e.g., Vol. 12, Issue 3",
  }, //vonumInum
  {
    type: "text",
    name: "doiUrl",
    label: "DOI or URL",
    placeholder: "https://...",
  }, //doiUrl
  {
    type: "text",
    name: "isbn",
    label: "ISBN or ISSN",
  },

  // SECTION A.3 Indexing / Accreditation
  {
    type: "radio",
    name: "isIsi",
    label: "ISI / Web of Science",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  }, //isIsi
  {
    type: "radio",
    name: "scopus",
    label: "Scopus",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  }, //scopus
  {
    type: "radio",
    name: "pubmedMedline",
    label: "PubMed / MEDLINE",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  }, //pubmedMedline
  {
    type: "radio",
    name: "isChedRecognized",
    label: "CHED-Recognized Journal",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  }, //isChedRecognized
  {
    type: "radio",
    name: "peerRev",
    label: "Peer-reviewed",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  }, //peerRev
  {
    type: "text",
    name: "otherDB",
    label: "Other reputable database",
    placeholder: "Specify if applicable",
  }, //otherDB
  {
    type: "text",
    name: "citationNum",
    label: "Number of Citations",
    placeholder: "Leave blank if not applicable",
  }, //citationNum

  // A.4  Supporting Documents
  {
    type: "file",
    name: "pubProof",
    label: "Proof of Publication",
    description: "Upload cover page, title page, acceptance letter, or preprint",
  }, //pubProof
  {
    type: "file",
    name: "pubUtilProof",
    label: "Proof of Utilization",
    description: "Upload citation evidence, sales data, UIPA, or indexed publication proof (if applicable)",
  }, //pubUtilProof
  {
    type: "textarea",
    name: "pubSupRemarks",
    label: "Remarks",
  }, //pubSupRemarks
  {
    type: "textarea",
    name: "pubRelatedKRAs",
    label: "Related KRAs / Sub-activities",
  }, //pubRelatedKRAs
]
