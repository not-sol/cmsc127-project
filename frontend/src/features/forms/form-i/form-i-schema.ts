import * as z from "zod"

const formISchema = z
  .object({
    // I.1 Partnership Identification
    contributingUnit: z
      .string()
      .min(1, "Contributing unit is required."),
    titleOfPartnership: z
      .string()
      .min(1, "Title of extension partnership / linkage is required."),
    scopeOfWork: z
      .string()
      .min(1, "Scope of work is required."),
    nameOfPartnerStakeholder: z
      .string()
      .min(1, "Name of partner stakeholder is required."),
    stakeholderCategory: z
      .string()
      .min(1, "Stakeholder category is required."),

    // I.2 Program Components
    trainingCourses: z
      .string()
      .min(1, "Please select Yes or No for Training Courses."),
    technicalAdvisoryService: z
      .string()
      .min(1, "Please select Yes or No for Technical / Advisory Service."),
    informationDissemination: z
      .string()
      .min(1, "Please select Yes or No for Information Dissemination / Mass Media."),
    consultancy: z
      .string()
      .min(1, "Please select Yes or No for Consultancy."),
    communityOutreach: z
      .string()
      .min(1, "Please select Yes or No for Community Outreach / Public Service."),
    technologyKnowledgeTransfer: z
      .string()
      .min(1, "Please select Yes or No for Technology / Knowledge Transfer."),
    organizingEvents: z
      .string()
      .min(1, "Please select Yes or No for Organizing Events."),

    // I.3 Agreement Details
    typeOfPartnershipAgreement: z
      .string()
      .min(1, "Type of partnership agreement is required."),
    otherAgreementType: z.string().optional(),
    partnershipStartDate: z.date({
      message: "Partnership effectivity start date is required.",
    }),
    partnershipEndDate: z.date({
      message: "Partnership effectivity end date is required.",
    }),

    // I.4 Supporting Documents
    moaDocument: z
      .array(z.instanceof(File))
      .min(1, "Please upload the MOA / MOU / Partnership Agreement."),
    remarks: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.partnershipStartDate && data.partnershipEndDate) {
      if (data.partnershipEndDate < data.partnershipStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be on or after the start date.",
          path: ["partnershipEndDate"],
        })
      }
    }
  })

type FormIValues = z.infer<typeof formISchema>

export { formISchema, type FormIValues }
