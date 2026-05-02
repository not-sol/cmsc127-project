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
  extras: z.enum(["default", "advanced", "__other__"], {
    message: "You need to select one type.",
  }),
  platforms: z
    .array(z.enum(["android", "ios"]))
    .min(1, "You must select at least one platform."),
  severity: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select a severity level.",
  }),
  dueDate: z.date({
    message: "Please select a due date.",
  }),
  other: z
    .string()
    .max(32, "Other text must be at most 32 characters.")
    .optional(),
  attachments: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one attachment.")
    .max(3, "You can upload up to 3 attachments."),

})
// .superRefine((values, context) => {
//   if (values.extras === "__other__" && !values.other?.trim()) {
//     context.addIssue({
//       code: "custom",
//       path: ["other"],
//       message: "Please describe the other option.",
//     })
//   }
// })

type FormValues = z.infer<typeof formSchema>

export { formSchema, type FormValues }
