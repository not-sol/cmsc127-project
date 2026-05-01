import {
  allowedAttachmentTypes,
  maxAttachmentSize,
  maxAttachments,
  type FormValues,
} from "@/features/forms/form-test/test-schema"
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
        value: "none",
        label: "None",
        description: "Standard option",
      },
      {
        value: "many",
        label: "Many",
        description: "More control",
      },
    ],
  },
  {
    type: "checkbox",
    name: "platforms",
    description: "this is a description",
    label: "Platforms",
    options: [
      {
        value: "chocolate",
        label: "Chocolate",
      },
      {
        value: "vanilla",
        label: "Vanilla",
      },
      {
        value: "strawberry",
        label: "Strawberry",
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
    description: "Attach screenshots or a PDF report.",
    allowedMimeTypes: allowedAttachmentTypes,
    maxFiles: maxAttachments,
    maxFileSize: maxAttachmentSize,
    multiple: true,
  }
]
