import type { FormIValues } from "@/features/forms/form-i/form-i-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]

export const formIFields: FormFieldConfig<FormIValues>[] = [
  // I.1 Partnership Identification
  {
    type: "radio",
    name: "contributingUnit",
    label: "Contributing Unit",
    description: "Select the department or contributing unit.",
    options: [
      { value: "CSMOD", label: "CSMOD" },
      { value: "DBSES", label: "DBSES" },
      { value: "DFSC", label: "DFSC" },
      { value: "DMPCS", label: "DMPCS" },
    ],
  },
  {
    type: "text",
    name: "titleOfPartnership",
    label: "Title of Extension Partnership / Linkage",
    placeholder: "Enter the title of the extension partnership or linkage",
  },
  {
    type: "textarea",
    name: "scopeOfWork",
    label: "Scope of Work",
    placeholder: "Provide a brief description of the scope of work...",
    description: "Briefly describe the scope of work under this partnership.",
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
      { value: "gov-lgu", label: "Government – LGU" },
      { value: "gov-nga", label: "Government – NGA" },
      { value: "gov-edu", label: "Government – Educational Institution" },
      { value: "priv-ngo", label: "Private – NGO" },
      { value: "priv-industry", label: "Private – Industry / Company" },
      { value: "priv-edu", label: "Private – Educational Institution" },
      { value: "priv-sme", label: "Private – SME / Cooperative" },
      {
        value: "foreign",
        label:
          "Foreign – Government / NGO / Company / Educational Institution",
      },
    ],
  },

  // I.2 Program Components
  {
    type: "radio",
    name: "trainingCourses",
    label: "Training Courses",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "technicalAdvisoryService",
    label: "Technical / Advisory Service",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "informationDissemination",
    label: "Information Dissemination / Mass Media",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "consultancy",
    label: "Consultancy",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "communityOutreach",
    label: "Community Outreach / Public Service",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "technologyKnowledgeTransfer",
    label: "Technology / Knowledge Transfer",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "organizingEvents",
    label: "Organizing Events",
    options: YES_NO_OPTIONS,
  },

  // I.3 Agreement Details
  {
    type: "radio",
    name: "typeOfPartnershipAgreement",
    label: "Type of Partnership Agreement",
    options: [
      { value: "MOA", label: "MOA" },
      { value: "MOU", label: "MOU" },
    ],
    otherOption: {
      name: "otherAgreementType",
      label: "Other type of agreement",
      placeholder: "Specify the type of agreement",
      clearOnDeselect: true,
    },
  },
  {
    type: "date-picker",
    name: "partnershipStartDate",
    label: "Partnership Effectivity Start Date",
    description: "Select the start date of the partnership effectivity.",
  },
  {
    type: "date-picker",
    name: "partnershipEndDate",
    label: "Partnership Effectivity End Date",
    description:
      "Select the end date of the partnership effectivity. Must be on or after the start date.",
  },

  // I.4 Supporting Documents
  {
    type: "file",
    name: "moaDocument",
    label: "MOA / MOU / Partnership Agreement",
    description:
      "Upload the signed document with requisite signatures.",
    multiple: true,
    allowedMimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10,
  },
  {
    type: "textarea",
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter any additional remarks (optional)...",
    optional: true,
  },
]
