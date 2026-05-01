import * as z from "zod"

export const allowedAttachmentTypes = ["image/*", "application/pdf"]
export const maxAttachmentSize = 1000 * 1000 * 10
export const maxAttachments = 10

function matchesMimeType(file: File, allowedTypes: string[]) {
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.slice(0, -1))
    }

    return file.type === type
  })
}

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  extras: z.enum(["default", "advanced"], {
    message: "You need to select one type.",
  }),
  platforms: z
    .array(z.enum(["android", "ios"]))
    .min(1, "You must select at least one platform."),
  severity: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select a severity level.",
  }),
  dueDate: z.date({
    message: "Please select a due date.",
  }),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "Please attach at least one file.")
    .max(maxAttachments, `You can attach up to ${maxAttachments} files.`)
    .refine(
      (files) => files.every((file) => matchesMimeType(file, allowedAttachmentTypes)),
      "Only images and PDF files are allowed."
    )
    .refine(
      (files) => files.every((file) => file.size <= maxAttachmentSize),
      "Each file must be 10 MB or smaller."
    ),
})

type FormValues = z.infer<typeof formSchema>

export { formSchema, type FormValues }
