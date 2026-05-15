import * as z from "zod"

function getFileInputType(value: unknown) {
  if (value instanceof File) return "File"
  if (Array.isArray(value)) return "File[]"
  if (typeof FileList !== "undefined" && value instanceof FileList) return "FileList"
  if (value === null) return "null"
  return typeof value
}

const singlePdfFileSchema = z
  .custom<File>(
    (value) => {
      const inputType = getFileInputType(value)
      console.log("[Form I validation] moaDocument input type:", inputType)

      if (Array.isArray(value)) {
        console.warn("[Form I validation] Schema mismatch: expected a single File, received File[].")
        return false
      }

      return value instanceof File
    },
    {
      message: "Please upload one signed MOA / MOU / Partnership Agreement PDF.",
    }
  )
  .refine((file) => file.type === "application/pdf", {
    message: "The signed agreement must be a PDF file.",
  })

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
    moaDocument: singlePdfFileSchema,
    remarks: z
      .string()
      .max(2000, "Remarks must be at most 2000 characters.")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
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
