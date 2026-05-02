import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  extras: z.enum(["default", "advanced", "other"], {
    message: "You need to select one type.",
  }),
  other: z
    .string()
    .max(32, "Other text must be at most 32 characters.")
    .optional(),
  platforms: z
    .array(z.enum(["android", "ios"]))
    .min(1, "You must select at least one platform."),
  severity: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select a severity level.",
  }),
  dueDate: z.date({
    message: "Please select a due date.",
  }),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one attachment.")
    .max(3, "You can upload up to 3 attachments."),

})
  .refine(
    (data) => data.extras !== "other" || (data.other?.trim().length ?? 0) > 0,
    { message: "Please specify your flavor", path: ["flavorOther"] }
  )

type FormValues = z.infer<typeof formSchema>

export { formSchema, type FormValues }
