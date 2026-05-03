import * as z from "zod"

const currentYear = new Date().getFullYear()

const formJAuthorshipSchema = z.object({
  titleOfMaterial: z
    .string()
    .min(1, "Title of Material is required.")
    .max(200, "Title must be at most 200 characters."),
  authors: z.string().min(1, "Author(s) is required."),
  year: z
    .string()
    .min(1, "Year is required.")
    .regex(/^\d{4}$/, "Year must be exactly 4 digits.")
    .refine(
      (val) => {
        const n = parseInt(val, 10)
        return n >= 1900 && n <= currentYear
      },
      { message: `Year must be between 1900 and ${currentYear}.` }
    ),
  attachments: z.array(z.instanceof(File)).optional(),
  remarks: z.string().optional(),
  relatedKRAs: z.string().optional(),
})

type FormJAuthorshipValues = z.infer<typeof formJAuthorshipSchema>

export { formJAuthorshipSchema, type FormJAuthorshipValues }
