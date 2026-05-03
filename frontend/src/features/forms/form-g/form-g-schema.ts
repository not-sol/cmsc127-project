import * as z from "zod"

const positiveWholeNumber = z
  .string()
  .min(1, "This field is required.")
  .regex(/^\d+$/, "Must be a valid whole number.")

const formGSchema = z.object({
  // G.1 Training Identification
  contributingUnit: z.string().min(1, "Contributing unit is required."),
  typeOfActivity: z.string().min(1, "Type of activity is required."),
  title: z
    .string()
    .min(1, "Title of training is required.")
    .max(200, "Title must be at most 200 characters."),
  venue: z
    .string()
    .min(1, "Venue is required.")
    .max(200, "Venue must be at most 200 characters."),
  startDate: z.date({
    message: "Start date is required.",
  }),
  endDate: z.date({
    message: "End date is required.",
  }),
  specialNotes: z
    .string()
    .max(500, "Special notes must be at most 500 characters."),
  trainingHours: positiveWholeNumber,
  totalTrainees: positiveWholeNumber,
  fundingSource: z.string().min(1, "Funding source is required."),

  // G.2 Client Satisfaction Survey
  sampleSize: z
    .string()
    .min(1, "Sample size is required.")
    .regex(/^\d+$/, "Must be a valid whole number (enter 0 if no survey was conducted)."),
  responsesPoor: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),
  responsesFair: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),
  responsesSatisfactory: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),
  responsesVerySatisfactory: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),
  responsesOutstanding: z
    .string()
    .min(1, "This field is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),

  // G.3 Extension Program Link
  isPartOfExtensionProgram: z
    .string()
    .min(1, "Please indicate whether this is part of an extension program."),
  relatedExtensionProgram: z.string(),

  // G.4 Supporting Documents
  attachments: z.array(z.instanceof(File)),
  remarks: z.string().max(2000, "Remarks must be at most 2000 characters."),
  relatedKras: z
    .string()
    .max(500, "Related KRAs / Sub-activities must be at most 500 characters."),
})

type FormGValues = z.infer<typeof formGSchema>

export { formGSchema, type FormGValues }
