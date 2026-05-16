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
    const inputType = getAttachmentInputType(value)
    const hasExistingAttachment = typeof value === "string" && value.trim().length > 0

    console.log("[Form B validation] supportingAttachments input type:", inputType)
    console.log("[Form B validation] existing attachment present:", hasExistingAttachment)

    if (value instanceof File) {
      return true
    }

    if (hasExistingAttachment) {
      return true
    }

    if (Array.isArray(value)) {
      console.warn("[Form B validation] Schema mismatch: expected one File or existing path, received File[].")
      return value.filter((file) => file instanceof File).length === 1
    }

    if (typeof FileList !== "undefined" && value instanceof FileList) {
      console.warn("[Form B validation] Schema mismatch: expected one File or existing path, received FileList.")
      return value.length === 1
    }

    return false
  }, "At least one (1) attachment is required unless an existing attachment is already saved.")

const formBSchema = z.object({

  //B.1 Research Identification
  contrUnit: z
  .enum(["csmod", "dbses", "dfsc", "dmpcs"], {
    message: "Research department/unit is required.",
  }),
  researchTitle: z
    .string()
    .min(1, "Research title is required."),
  researchType: z
  .enum(["basic", "applied", "policy"]),

  //B.2  Duration & Status
  rStartDate: z.date({
    message: "Start date is required.",
  }),
  rEndDate: z
    .date()
    .optional(),
  researchTimeframeMonths: z
    .string()
    .min(1, "Number of months is required.")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid number"),

  //B.3  Researcher Information
  researcherNames: z
    .string()
    .min(1, "At least one (1) researcher is required."),
  
  //B.4  Funding
  upSystemResearchGrantPesos: z
    .string()
    .min(1, "Please enter a valid amount that must be zero or greater."),
  externalFundingAmountPesos: z
    .string()
    .min(1, "Please enter a valid amount that must be zero or greater."),
  totalFundingPesos: z
    .string()
    .min(1, "Please enter a valid amount that must be zero or greater."),
  otherFundSource: z
   .string()
   .optional(),
  majoritySource: z
  .enum(["genFundCurYr", "genFundSup", "revolFund", "intGenFund", "rpGovtTrustFund", "rpGovtDirFund", "rpPrivTrustFund", "forTrustFund", "forDirFund"], {
    message: "Majority share required.",
  }),
  
  // B.5 Supporting Documents
  supportingAttachments: singleAttachmentSchema,
  researchRemarks: z
   .string().optional(),
  researchRelatedKRAs: z
    .string().optional(),
});

type FormValues = z.infer<typeof formBSchema>

export { formBSchema, type FormValues }
