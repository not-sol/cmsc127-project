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
  venue: z
    .string()
    .max(500, "Venue must be at most 500 characters.")
    .optional(),
  participation: z
    .string()
    .max(500, "Participation must be at most 500 characters.")
    .optional(),
  remarks: z
    .string()
    .max(2000, "Remarks must be at most 2000 characters.")
    .optional(),
  relatedKras: z
    .string()
    .max(1000, "Related KRAs must be at most 1000 characters.")
    .optional(),
  date: z.date({
    message: "Date of accomplishment is required.",
  }),
  endDate: z.date().optional(),
  supportingDocuments: z
    .union([
      z.array(z.instanceof(File)).min(1, "Please upload at least one supporting document."),
      z.string().min(1, "Please upload at least one supporting document."),
    ]),
})

type FormKOtherValues = z.infer<typeof formKOtherSchema>

export { formKOtherSchema, type FormKOtherValues }
