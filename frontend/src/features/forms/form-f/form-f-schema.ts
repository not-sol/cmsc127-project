import * as z from "zod"

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
  attachments: z.array(z.instanceof(File)),
  remarks: z.string().optional(),
  relatedKras: z.string().optional(),
})

type FormFValues = z.infer<typeof formFSchema>

export { formFSchema, type FormFValues }
