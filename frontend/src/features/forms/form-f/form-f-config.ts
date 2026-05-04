import type { FormFValues } from "@/features/forms/form-f/form-f-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFFields: FormFieldConfig<FormFValues>[] = [
  // ── F.1 Award / Grant Details ─────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_f1",
    label: "F.1 Award / Grant Details",
    description:
      "Awards and grants are recorded for completeness and support performance narratives.",
  },
  {
    type: "radio",
    name: "type",
    label: "Type",
    options: [
      { value: "academic_institutional", label: "Academic / Institutional" },
      { value: "national", label: "National" },
      { value: "international", label: "International" },
    ],
  },
  {
    type: "text",
    name: "awardGrantTitle",
    label: "Award / Grant Title",
    placeholder: "Enter the title of the award or grant",
  },
  {
    type: "text",
    name: "sourceAwardingBody",
    label: "Source / Awarding Body",
    placeholder: "Enter the name of the source or awarding body",
  },
  {
    type: "textarea",
    name: "details",
    label: "Details",
    placeholder: "Brief description of the award or grant",
    description: "Provide a brief description of the award or grant.",
  },
  {
    type: "date-picker",
    name: "startDate",
    label: "Start Date",
    description: "Select the start date (MM/DD/YYYY).",
    optional: true,
  },
  {
    type: "date-picker",
    name: "endDate",
    label: "End Date",
    description: "Select the end date (MM/DD/YYYY).",
    optional: true,
  },

  // ── F.2 Supporting Documents ──────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_f2",
    label: "F.2 Supporting Documents",
  },
  {
    type: "file",
    name: "attachments",
    label: "Attachments",
    description: "Upload certificate, letter of award, or MOA.",
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
    type: "text",
    name: "relatedKras",
    label: "Related KRAs / Sub-activities",
    placeholder: "List related KRAs or sub-activities",
    optional: true,
  },
]
