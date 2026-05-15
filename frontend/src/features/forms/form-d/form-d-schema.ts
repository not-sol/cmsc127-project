import * as z from "zod"

const formDSchema = z.object({

  //D.1 Patent Identification
  researchTitle3: z
    .string()
    .min(1, "Linked research title is required."),
  patentTitle: z
    .string()
    .min(1, "Title of patent is required."),
  patentType: z
  .enum(["invention", "utilityModel", "industrialDesign"],{
    message: "Type of patent is required.",
  }),

  //D.2  Application & Grant Details
  aplNum: z
    .string()
    .min(1, "Application number is required."),
  aplInventors: z
    .string()
    .min(1, "Name of inventor(s) is required."),
  aplApplicants: z
    .string()
    .min(1, "Name of applicant / owner(s) is required."),
  unexaminedApplicationDate: z.date({
    message: "Date of publication of unexamined application is required.",
  }),
  grantPatentDate: z.date().optional(),
  regisNum: z
    .string()
    .optional(),
  commercialProduct: z
    .string()
    .optional(),
  utilType: z.enum(["nAUtil", "techDev", "servProv", "endProduct"], {
    message: "Utilization of research output is required.",
  }),
  
  // D.3 Supporting Documents
  patentAttachments: z
    .any()
    .refine((val) => {
      if (!val) return false;
      if (val instanceof File) return true;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof FileList !== "undefined" && val instanceof FileList) return val.length > 0;
      if (typeof val === "string") return val.length > 0;
      return true;
    }, "At least one (1) attachment is required."),
  patentRemarks: z
   .string().optional(),
});

type FormValues = z.infer<typeof formDSchema>

export { formDSchema, type FormValues }
