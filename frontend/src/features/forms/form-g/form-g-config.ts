import type { FormGValues } from "@/features/forms/form-g/form-g-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

const CONTRIBUTING_UNIT_OPTIONS = [
  { value: "CSMOD", label: "CSMOD" },
  { value: "DBSES", label: "DBSES" },
  { value: "DFSC", label: "DFSC" },
  { value: "DMPCS", label: "DMPCS" },
]

export const formGFields: FormFieldConfig<FormGValues>[] = [
  // ── G.1 Training Identification ──────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_g1",
    label: "G.1 Training Identification",
  },
  {
    type: "radio",
    name: "contributingUnit",
    label: "Contributing Unit",
    description: "Select the department that conducted this training.",
    options: CONTRIBUTING_UNIT_OPTIONS,
  },
  {
    type: "radio",
    name: "typeOfActivity",
    label: "Type of Activity",
    options: [
      { value: "training", label: "Training (non-degree and non-credit)" },
      { value: "seminar", label: "Seminar" },
      { value: "workshop", label: "Workshop" },
      { value: "forum", label: "Forum" },
    ],
  },
  {
    type: "text",
    name: "title",
    label: "Title of Training Conducted",
    placeholder: "Enter the title of the training",
  },
  {
    type: "text",
    name: "venue",
    label: "Venue, City, Municipality, Province",
    placeholder: "e.g., CAS Auditorium, Diliman, Quezon City, Metro Manila",
  },
  {
    type: "date-picker",
    name: "startDate",
    label: "Start Date",
    description: "Select the start date of the training (MM/DD/YYYY).",
  },
  {
    type: "date-picker",
    name: "endDate",
    label: "End Date",
    description:
      "Select the end date of the training (MM/DD/YYYY). Use the same date as the start date for a one-day event.",
  },
  {
    type: "textarea",
    name: "specialNotes",
    label: "Special Notes on Schedule",
    placeholder: "e.g., staggered schedule, postponements",
    description:
      "Note any irregularities or special arrangements in the training schedule.",
    optional: true,
  },
  {
    type: "text",
    name: "trainingHours",
    label: "Number of Training Hours Required",
    placeholder: "e.g., 16",
    description: "Enter the total number of training hours. Convert: 1 day = 8 hours.",
  },
  {
    type: "text",
    name: "totalTrainees",
    label: "Total Number of Trainees",
    placeholder: "e.g., 30",
  },
  {
    type: "radio",
    name: "fundingSource",
    label: "Source of Majority Share of Funding",
    options: [
      { value: "up_general_current", label: "UP General Fund – Current Year" },
      { value: "up_general_supplemental", label: "UP General Fund – Supplemental" },
      { value: "up_revolving", label: "UP Revolving Fund" },
      { value: "up_igi", label: "UP Internally Generated Fund" },
      { value: "rp_gov_trust", label: "RP Gov't – UP Trust Funds" },
      { value: "rp_gov_direct", label: "RP Gov't – Direct Funding" },
      { value: "rp_private_trust", label: "RP Private – UP Trust Funds" },
      { value: "foreign_trust", label: "Foreign – UP Trust Funds" },
      { value: "foreign_direct", label: "Foreign – Direct Funding" },
    ],
  },

  // ── G.2 Client Satisfaction Survey ───────────────────────────────────────
  {
    type: "section-header",
    name: "_section_g2",
    label: "G.2 Client Satisfaction Survey",
    description:
      "PBMS Form K — required if a survey was conducted. Sample size must be at least 25% of total trainees. Enter 0 if no survey was conducted.",
  },
  {
    type: "text",
    name: "sampleSize",
    label: "Sample Size",
    placeholder: "e.g., 25",
    description:
      "Minimum 25% of total trainees. Enter 0 if no survey was conducted.",
  },
  {
    type: "text",
    name: "responsesPoor",
    label: "No. of Responses — Poor / Below Fair",
    placeholder: "e.g., 0",
  },
  {
    type: "text",
    name: "responsesFair",
    label: "No. of Responses — Fair",
    placeholder: "e.g., 0",
  },
  {
    type: "text",
    name: "responsesSatisfactory",
    label: "No. of Responses — Satisfactory",
    placeholder: "e.g., 0",
  },
  {
    type: "text",
    name: "responsesVerySatisfactory",
    label: "No. of Responses — Very Satisfactory",
    placeholder: "e.g., 0",
  },
  {
    type: "text",
    name: "responsesOutstanding",
    label: "No. of Responses — Outstanding",
    placeholder: "e.g., 0",
  },

  // ── G.3 Extension Program Link ────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_g3",
    label: "G.3 Extension Program Link",
    description: "PBMS Form L — indicate if this training is part of an extension program.",
  },
  {
    type: "radio",
    name: "isPartOfExtensionProgram",
    label: "Is this part of an Extension Program?",
    options: [
      { value: "no", label: "No — standalone training" },
    ],
    otherOption: {
      name: "relatedExtensionProgram",
      value: "yes",
      label: "Yes — specify program below",
      placeholder: "Enter or select the related extension program from Section H",
      clearOnDeselect: true,
    },
  },

  // ── G.4 Supporting Documents ──────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_g4",
    label: "G.4 Supporting Documents",
  },
  {
    type: "file",
    name: "attachments",
    label: "Attachments",
    description:
      "Upload training materials, certificates, or attendance sheets.",
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
  {
    type: "textarea",
    name: "relatedKras",
    label: "Related KRAs / Sub-activities",
    placeholder: "List related KRAs or sub-activities",
    optional: true,
  },
]
