import * as z from "zod"

const formKOtherSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(2000, "Description must be at most 2000 characters."),
  date: z.date({
    message: "Date of accomplishment is required.",
  }),
  supportingDocuments: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one supporting document."),
})

type FormKOtherValues = z.infer<typeof formKOtherSchema>

export { formKOtherSchema, type FormKOtherValues }
