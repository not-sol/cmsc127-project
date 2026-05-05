import type { FormValues } from "@/features/forms/form-b/form-b-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFields: FormFieldConfig<FormValues>[] = [
  // SECTION B.1
  { //contrUnit
    type: "radio",
    name: "contrUnit",
    label: "Contributing Unit",
    options: [
      { value: "csmod", label: "CSMOD" },
      { value: "dbses", label: "DBSES" },
      { value: "dfsc", label: "DFSC" },
      { value: "dmpcs", label: "DMPCS" },
    ],
  },
  { //researchTitle
    type: "text",
    name: "researchTitle",
    label: "Title of Research Project / Program / Work",
    placeholder: "Full title as approved",
  },
  { //researchType
    type: "radio",
    name: "researchType",
    label: "Research Type",
    options: [
      { value: "basic", label: "Basic" },
      { value: "applied", label: "Applied" },
      { value: "policy", label: "Policy" },
    ],
  },

  // SECTION B.2
  { //rStartDate
    type: "date-picker",
    name: "rStartDate",
    label: "Start Date",
    placeholder: "MM/DD/YYYY",
  },
  { //rEndDate
    type: "date-picker",
    name: "rEndDate",
    label: "End Date",
    placeholder: "MM/DD/YYYY - leave blank if ongoing",
  },
  { //researchTimeframeMonths
    type: "text",
    name: "researchTimeframeMonths",
    label: "No. of Months in Original Timeframe",
    placeholder: "As originally approved; exclude extensions",
  },

  // SECTION B.3
  { //researcherNames
    type: "text",
    name: "researcherNames",
    label: "Name of Researcher(s)",
    placeholder: "Lead researcher first; separate with semicolons",
  },

  // SECTION B.4
  { //upSystemResearchGrantPesos
    type: "text",
    name: "upSystemResearchGrantPesos",
    label: "UP System Research Grant (PHP)",
    placeholder: "0.00",
  },
  { //externalFundingAmountPesos
    type: "text",
    name: "externalFundingAmountPesos",
    label: "External Funding Amount (PHP)",
    placeholder: "0.00",
  },
  { //totalFundingPesos
    type: "text",
    name: "totalFundingPesos",
    label: "Total Funding (PHP)",
    placeholder: "e.g., Vol. 12, Issue 3",
  },
  { //otherFundSource
    type: "text",
    name: "otherFundSource",
    label: "Other Fund Source",
    placeholder: "Specify if applicable",
  },
  { //contrUnit
    type: "radio",
    name: "majoritySource",
    label: "Source of Majority Share of Funding",
    options: [
      { value: "genFundCurYr", label: "UP General Fund - Current Year" },
      { value: "genFundSup", label: "UP General Fund - Supplemental" },
      { value: "revolFund", label: "UP Revolving Fund" },
      { value: "intGenFund", label: "UP Internally Generated Fund" },
      { value: "rpGovtTrustFund", label: "RP Gov't - UP Trust Funds" },
      { value: "rpGovtDirFund", label: "RP Gov't - Direct Funding" },
      { value: "rpPrivTrustFund", label: "RP Private - UP Trust Funds" },
      { value: "forTrustFund", label: "Foreign - UP Trust Funds" },
      { value: "forDirFund", label: "Foreign - Direct Funding" },
    ],
  },

  // B.5  Supporting Documents
  { //supportingAttachments
    type: "file",
    name: "supportingAttachments",
    label: "Attachments",
    description: "Upload cover page, title page, acceptance letter, or preprint",
  },
  { //researchRemarks
    type: "textarea",
    name: "researchRemarks",
    label: "Remarks",
  },
  { //researchRelatedKRAs
    type: "textarea",
    name: "researchRelatedKRAs",
    label: "Related KRAs / Sub-activities",
  },
]
