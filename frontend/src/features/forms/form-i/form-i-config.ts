import type { FormIPartnershipValues } from "@/features/forms/form-i/form-i-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formIPartnershipFields: FormFieldConfig<FormIPartnershipValues>[] = [
  // I.1 Partnership Identification
  {
    type: "radio",
    name: "contributingUnit",
    label: "Contributing Unit",
    description: "Select the department contributing to this partnership.",
    options: [
      { value: "CSMOD", label: "CSMOD" },
      { value: "DBSES", label: "DBSES" },
      { value: "DFSC", label: "DFSC" },
      { value: "DMPCS", label: "DMPCS" },
    ],
  },
  {
    type: "text",
    name: "titleOfExtensionPartnership",
    label: "Title of Extension Partnership / Linkage",
    placeholder: "Enter the title of the extension partnership or linkage",
  },
  {
    type: "textarea",
    name: "scopeOfWork",
    label: "Scope of Work",
    placeholder: "Provide a brief description of the scope of work...",
    description: "Provide a brief description of the scope of work.",
  },
  {
    type: "text",
    name: "nameOfPartnerStakeholder",
    label: "Name of Partner Stakeholder",
    placeholder: "Enter the name of the partner stakeholder",
  },
  {
    type: "radio",
    name: "stakeholderCategory",
    label: "Stakeholder Category",
    options: [
      { value: "government-lgu", label: "Government – LGU" },
      { value: "government-nga", label: "Government – NGA" },
      {
        value: "government-educational",
        label: "Government – Educational Institution",
      },
      { value: "private-ngo", label: "Private – NGO" },
      { value: "private-industry", label: "Private – Industry / Company" },
      {
        value: "private-educational",
        label: "Private – Educational Institution",
      },
      {
        value: "private-sme-cooperative",
        label: "Private – SME / Cooperative",
      },
      {
        value: "foreign",
        label: "Foreign – Government / NGO / Company / Educational Institution",
      },
    ],
  },
  // I.2 Program Components
  {
    type: "radio",
    name: "trainingCourses",
    label: "Training Courses",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "technicalAdvisoryService",
    label: "Technical / Advisory Service",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "informationDissemination",
    label: "Information Dissemination / Mass Media",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "consultancy",
    label: "Consultancy",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "communityOutreach",
    label: "Community Outreach / Public Service",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "technologyKnowledgeTransfer",
    label: "Technology / Knowledge Transfer",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    type: "radio",
    name: "organizingEvents",
    label: "Organizing Events",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  // I.3 Agreement Details
  {
    type: "radio",
    name: "typeOfPartnershipAgreement",
    label: "Type of Partnership Agreement",
    options: [
      { value: "MOA", label: "MOA" },
      { value: "MOU", label: "MOU" },
      { value: "other", label: "Other type of agreement" },
    ],
  },
  {
    type: "date-picker",
    name: "partnershipEffectivityStartDate",
    label: "Partnership Effectivity Start Date",
    description: "Select the start date of the partnership effectivity period.",
  },
  {
    type: "date-picker",
    name: "partnershipEffectivityEndDate",
    label: "Partnership Effectivity End Date",
    description:
      "Select the end date of the partnership effectivity period. Must not be before the start date.",
  },
  // I.4 Supporting Documents
  {
    type: "file",
    name: "moaDocument",
    label: "MOA / MOU / Partnership Agreement",
    description:
      "Upload the signed MOA, MOU, or partnership agreement with requisite signatures.",
    allowedMimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10,
  },
  {
    type: "textarea",
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter any additional remarks...",
  },
]
