import type { FormKOtherValues } from "@/features/forms/form-k/form-k-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formKOtherFields: FormFieldConfig<FormKOtherValues>[] = [
  {
    type: "text",
    name: "title",
    label: "Title of Accomplishment",
    placeholder: "Enter the title of the accomplishment",
    description:
      "Provide a concise title that clearly identifies this accomplishment.",
  },
  {
    type: "textarea",
    name: "description",
    label: "Description of Accomplishment",
    placeholder:
      "Describe the accomplishment in detail, including its significance and impact...",
    description:
      "Include relevant details such as the nature of the accomplishment, beneficiaries, scope, and any notable outcomes.",
  },
  {
    type: "date-picker",
    name: "date",
    label: "Date of Accomplishment",
    description: "Select the date on which the accomplishment occurred.",
  },
  {
    type: "date-picker",
    name: "endDate",
    label: "End Date",
    description: "Select the end date if applicable.",
    optional: true,
  },
  {
    type: "text",
    name: "venue",
    label: "Venue",
    placeholder: "Enter the venue",
    description: "Provide the venue or location of the accomplishment, if applicable.",
    optional: true,
  },
  {
    type: "text",
    name: "participation",
    label: "Participation",
    placeholder: "Enter the nature of participation",
    description: "Describe your role or participation in this accomplishment.",
    optional: true,
  },
  {
    type: "textarea",
    name: "relatedKras",
    label: "Related KRAs",
    placeholder: "Enter related KRAs",
    description: "List any key result areas connected to this accomplishment.",
    optional: true,
  },
  {
    type: "textarea",
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter any additional remarks or notes",
    description: "Add remarks that should be available for review and reports.",
    optional: true,
  },
  {
    type: "file",
    name: "supportingDocuments",
    label: "Supporting Documents",
    description:
      "Upload documents that serve as evidence or supporting materials for this accomplishment (e.g., certificates, letters, reports).",
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
]
