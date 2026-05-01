import type { FormValues } from "@/features/forms/form-test/test-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFields: FormFieldConfig<FormValues>[] = [
  {
    type: "text",
    name: "title",
    label: "Bug Title",
    placeholder: "Login button broken",
  },
  {
    type: "textarea",
    name: "description",
    label: "Description",
    placeholder: "Explain the issue...",
  },
  {
    type: "radio",
    name: "extras",
    description: "Oh hell naww",
    label: "Extras",
    options: [
      {
        value: "default",
        label: "Default",
        description: "Standard option",
      },
      {
        value: "advanced",
        label: "Advanced",
        description: "More control",
      },
    ],
    otherOption: {
      name: "other",
      label: "Other",
      placeholder: "Enter another reason",
    },
  },
  {
    type: "checkbox",
    name: "platforms",
    description: "this is a description",
    label: "Platforms",
    options: [
      {
        value: "android",
        label: "Android",
      },
      {
        value: "ios",
        label: "iOS",
      },
    ],
  },
  {
    type: "select",
    name: "severity",
    label: "Severity Level",
    description: "How severe is this bug?",
    placeholder: "Select severity",
    options: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "critical", label: "Critical" },
    ],
  },
  {
    type: "date-picker",
    name: "dueDate",
    label: "Due Date",
    description: "When should this bug be fixed?",
  },
  {
    type: "file",
    name: "attachments",
    label: "Attachments",
    description: "Upload screenshots, logs, or a short PDF report.",
    multiple: true,
    allowedMimeTypes: ["image/*", "application/pdf", "text/plain"],
    maxFiles: 3,
    maxFileSize: 1000 * 1000 * 5,
  }
]
