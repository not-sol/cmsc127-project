import type { FormJAuthorshipValues } from "@/features/forms/form-j/form-j-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formJAuthorshipFields: FormFieldConfig<FormJAuthorshipValues>[] = [
  {
    type: "text",
    name: "titleOfMaterial",
    label: "Title of Material",
    placeholder: "Enter the title of the material",
  },
  {
    type: "text",
    name: "authors",
    label: "Author(s)",
    placeholder: "e.g., Dela Cruz, Juan; Reyes, Maria",
    description: "Separate multiple authors with semicolons",
  },
  {
    type: "text",
    name: "year",
    label: "Year",
    placeholder: "YYYY",
    description: "Enter the four-digit year of authorship.",
  },
  {
    type: "file",
    name: "attachments",
    label: "Attachments",
    description:
      "Upload cover page or proof of authorship (e.g., title page, certification letter).",
    optional: true,
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
    placeholder: "Enter any additional remarks...",
    optional: true,
  },
  {
    type: "textarea",
    name: "relatedKRAs",
    label: "Related KRAs / Sub-activities",
    placeholder: "Enter related KRAs or sub-activities...",
    optional: true,
  },
]
