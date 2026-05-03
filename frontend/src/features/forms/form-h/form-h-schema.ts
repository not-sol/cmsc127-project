import * as z from "zod"

const yesNoField = z
  .string()
  .min(1, "Please select Yes or No.")

const formHSchema = z.object({
  // H.1 Program Identification
  contributingUnit: z.string().min(1, "Contributing unit is required."),
  title: z
    .string()
    .min(1, "Title of extension program is required.")
    .max(200, "Title must be at most 200 characters."),

  // H.2 Program Components
  trainingCourses: yesNoField,
  technicalAdvisoryService: yesNoField,
  informationDissemination: yesNoField,
  consultancy: yesNoField,
  communityOutreach: yesNoField,
  technologyTransfer: yesNoField,
  organizing: yesNoField,

  // H.3 Program Details
  academicDegreePrograms: z
    .string()
    .max(500, "Academic degree programs must be at most 500 characters."),
  scopeOfWork: z
    .string()
    .min(1, "Scope of work is required.")
    .max(2000, "Scope of work must be at most 2000 characters."),
  startDate: z.date({
    message: "Start date is required.",
  }),
  endDate: z.date({
    message: "End date is required.",
  }),
  targetBeneficiary: z
    .string()
    .min(1, "Target beneficiary group(s) is required.")
    .max(500, "Target beneficiary must be at most 500 characters."),
  numberOfBeneficiaries: z
    .string()
    .min(1, "Number of beneficiary groups or persons served is required.")
    .regex(/^\d+$/, "Must be a valid whole number."),
  fundingSource: z.string().min(1, "Funding source is required."),

  // H.4 Supporting Documents
  programDocuments: z.array(z.instanceof(File)),
  remarks: z.string().max(2000, "Remarks must be at most 2000 characters."),
})

type FormHValues = z.infer<typeof formHSchema>

export { formHSchema, type FormHValues }
