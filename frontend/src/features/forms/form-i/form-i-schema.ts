import * as z from "zod"

const formIPartnershipSchema = z
  .object({
    contributingUnit: z.enum(["CSMOD", "DBSES", "DFSC", "DMPCS"], {
      message: "Contributing unit is required.",
    }),
    titleOfExtensionPartnership: z
      .string()
      .min(1, "Title of extension partnership is required.")
      .max(200, "Title must be at most 200 characters."),
    scopeOfWork: z
      .string()
      .min(1, "Scope of work is required.")
      .max(2000, "Scope of work must be at most 2000 characters."),
    nameOfPartnerStakeholder: z
      .string()
      .min(1, "Name of partner stakeholder is required.")
      .max(200, "Name must be at most 200 characters."),
    stakeholderCategory: z.enum(
      [
        "government-lgu",
        "government-nga",
        "government-educational",
        "private-ngo",
        "private-industry",
        "private-educational",
        "private-sme-cooperative",
        "foreign",
      ],
      { message: "Stakeholder category is required." }
    ),
    trainingCourses: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    technicalAdvisoryService: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    informationDissemination: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    consultancy: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    communityOutreach: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    technologyKnowledgeTransfer: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    organizingEvents: z.enum(["yes", "no"], {
      message: "Please select Yes or No.",
    }),
    typeOfPartnershipAgreement: z.enum(["MOA", "MOU", "other"], {
      message: "Type of partnership agreement is required.",
    }),
    partnershipEffectivityStartDate: z.date({
      message: "Partnership effectivity start date is required.",
    }),
    partnershipEffectivityEndDate: z.date({
      message: "Partnership effectivity end date is required.",
    }),
    moaDocument: z
      .array(z.instanceof(File))
      .min(1, "Please upload the signed MOA / MOU / Partnership Agreement."),
    remarks: z.string().max(2000, "Remarks must be at most 2000 characters.").optional(),
  })
  .refine(
    (data) => {
      if (data.partnershipEffectivityStartDate && data.partnershipEffectivityEndDate) {
        return data.partnershipEffectivityEndDate >= data.partnershipEffectivityStartDate
      }
      return true
    },
    {
      message: "End date cannot be before start date.",
      path: ["partnershipEffectivityEndDate"],
    }
  )

type FormIPartnershipValues = z.infer<typeof formIPartnershipSchema>

export { formIPartnershipSchema, type FormIPartnershipValues }
