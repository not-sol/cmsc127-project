import * as z from "zod"

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
    .optional(),

  //B.3  Researcher Information
  researcherNames: z
    .string()
    .min(1, "At least one (1) researcher is required."),
  
  //B.4  Funding
  upSystemResearchGrantPesos: z
  .coerce.number({
    message: "Please enter a valid amount.",
    })
    .nonnegative("Amount must be zero or greater.")
    .default(0),
  externalFundingAmountPesos: z
  .coerce.number({
    message: "Please enter a valid amount.",
    })
    .nonnegative("Amount must be zero or greater.")
    .default(0),
  totalFundingPesos: z
  .coerce.number({
    message: "Please enter a valid amount.",
    })
    .nonnegative("Amount must be zero or greater.")
    .default(0),
  otherFundSource: z
   .string()
   .optional(),
  majoritySource: z
  .enum(["genFundCurYr", "genFundSup", "revolFund", "intGenFund", "rpGovtTrustFund", "rpGovtDirFund", "rpPrivTrustFund", "forTrustFund", "forDirFund"], {
    message: "Majority share required.",
  }),
  
  // B.5 Supporting Documents
  supportingAttachments: z
    .any()
    .refine((files) => files?.length > 0, "At least one (1) attachment is required."),
  researchRemarks: z
   .string().optional(),
  researchRelatedKRAs: z
    .string().optional(),
});

type FormValues = z.infer<typeof formBSchema>

export { formBSchema, type FormValues }