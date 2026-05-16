import * as z from "zod"

function getAttachmentInputType(value: unknown) {
  if (value instanceof File) return "File"
  if (Array.isArray(value)) return "File[]"
  if (typeof FileList !== "undefined" && value instanceof FileList) return "FileList"
  if (typeof value === "string") return "existing-path"
  if (value === null) return "null"
  return typeof value
}

const singleAttachmentSchema = z
  .any()
  .refine((value) => {
    console.log("[Form F validation] attachments input type:", getAttachmentInputType(value))

    if (value === undefined || value === null || value === "") {
      return true
    }

    if (value instanceof File) {
      return true
    }

    if (typeof value === "string") {
      return value.trim().length > 0
    }

    if (Array.isArray(value)) {
      return value.filter((file) => file instanceof File).length <= 1
    }

    if (typeof FileList !== "undefined" && value instanceof FileList) {
      return value.length <= 1
    }

    console.error("[Form F validation] Invalid attachment value; refusing raw file metadata.", value)
    return false
  }, "Form F supports only one attachment.")

const formFSchema = z.object({
  // F.1 Award / Grant Details
  type: z.string().min(1, "Type is required."),
  awardGrantTitle: z
    .string()
    .min(1, "Award / grant title is required.")
    .max(200, "Title must be at most 200 characters."),
  sourceAwardingBody: z
    .string()
    .min(1, "Source / awarding body is required."),
  details: z
    .string()
    .min(1, "Details are required.")
    .max(2000, "Details must be at most 2000 characters."),
  startDate: z.date().optional(),
  endDate: z.date().optional(),

  // F.2 Supporting Documents
  attachments: singleAttachmentSchema,
  remarks: z.string().optional(),
  relatedKras: z.string().optional(),
})

type FormFValues = z.infer<typeof formFSchema>

export { formFSchema, type FormFValues }
