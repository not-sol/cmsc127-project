import type { FormHValues } from "@/features/forms/form-h/form-h-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

const CONTRIBUTING_UNIT_OPTIONS = [
  { value: "CSMOD", label: "CSMOD" },
  { value: "DBSES", label: "DBSES" },
  { value: "DFSC", label: "DFSC" },
  { value: "DMPCS", label: "DMPCS" },
]

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]

export const formHFields: FormFieldConfig<FormHValues>[] = [
  // ── H.1 Program Identification ────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_h1",
    label: "H.1 Program Identification",
    description:
      "An Extension Program must be part of the approved Extension Work Agenda and must be a holistic, integrated program — not individual extension activities. Individual trainings are recorded in Section G.",
  },
  {
    type: "radio",
    name: "contributingUnit",
    label: "Contributing Unit",
    description: "Select the department responsible for this extension program.",
    options: CONTRIBUTING_UNIT_OPTIONS,
  },
  {
    type: "text",
    name: "title",
    label: "Title of Extension Program",
    placeholder: "Enter the title of the extension program",
  },

  // ── H.2 Program Components ────────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_h2",
    label: "H.2 Program Components",
    description: "Check all components that apply to this extension program.",
  },
  {
    type: "radio",
    name: "trainingCourses",
    label: "Training Courses (non-degree and non-credit)",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "technicalAdvisoryService",
    label: "Technical / Advisory Service for external clients",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "informationDissemination",
    label: "Information Dissemination / Communication through mass media",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "consultancy",
    label: "Consultancy for external clients",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "communityOutreach",
    label: "Community Outreach or Public Service",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "technologyTransfer",
    label: "Technology or Knowledge Transfer to target users",
    options: YES_NO_OPTIONS,
  },
  {
    type: "radio",
    name: "organizing",
    label: "Organizing (symposium, forum, exhibit, performance, conference)",
    options: YES_NO_OPTIONS,
  },

  // ── H.3 Program Details ───────────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_h3",
    label: "H.3 Program Details",
  },
  {
    type: "textarea",
    name: "academicDegreePrograms",
    label: "Academic Degree Program(s) Benefited / Enhanced",
    placeholder: "e.g., BS Biology, MS Environmental Science",
    description:
      "Indicate programs that were benefited or enhanced, whether or not tangible outcomes are present.",
    optional: true,
  },
  {
    type: "textarea",
    name: "scopeOfWork",
    label: "Scope of Work",
    placeholder: "Provide a brief description of the extension program's scope and objectives...",
    description: "Brief description of the program's coverage, objectives, and expected outcomes.",
  },
  {
    type: "date-picker",
    name: "startDate",
    label: "Start Date",
    description: "Select the start date of the extension program (MM/DD/YYYY).",
  },
  {
    type: "date-picker",
    name: "endDate",
    label: "End Date",
    description: "Select the end date of the extension program (MM/DD/YYYY).",
  },
  {
    type: "textarea",
    name: "targetBeneficiary",
    label: "Target Beneficiary Group(s)",
    placeholder: "Describe the target population or beneficiary groups",
    description: "Describe the intended recipients or target population of this extension program.",
  },
  {
    type: "text",
    name: "numberOfBeneficiaries",
    label: "Number of Target Beneficiary Groups or Persons Served",
    placeholder: "e.g., 150",
  },
  {
    type: "radio",
    name: "fundingSource",
    label: "Source of Majority Share of Funding",
    options: [
      { value: "up_general_current", label: "UP General Fund – Current Year" },
      { value: "up_revolving", label: "UP Revolving Fund" },
      { value: "up_igi", label: "UP Internally Generated Fund" },
      { value: "rp_gov_direct", label: "RP Gov't – Direct Funding" },
      { value: "foreign_direct", label: "Foreign – Direct Funding" },
      { value: "other", label: "Other" },
    ],
  },

  // ── H.4 Supporting Documents ──────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_h4",
    label: "H.4 Supporting Documents",
  },
  {
    type: "file",
    name: "programDocuments",
    label: "Program Description / MOA / Activity Reports",
    description:
      "Upload the program framework, budget, endorsement letters, memoranda of agreement, or activity reports.",
    multiple: true,
    allowedMimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10,
    optional: true,
  },
  {
    type: "textarea",
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter any additional remarks or notes",
    optional: true,
  },
]
