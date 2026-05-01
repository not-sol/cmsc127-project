/* eslint-disable react-refresh/only-export-components */
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
  extras: z.enum(["default", "advanced"], {
    message: "You need to select one type.",
  }),
  platforms: z
    .array(z.enum(["android", "ios"]))
    .min(1, "You must select at least one platform."),

  // severity: z.enum(["low", "medium", "high", "critical"], {
  //   message: "Please select a severity level.",
  // }),
  //
  // dueDate: z.date({
  //   message: "Please select a due date.",
  // }),

})

type FormValues = z.infer<typeof formSchema>

export { formSchema, type FormValues }
