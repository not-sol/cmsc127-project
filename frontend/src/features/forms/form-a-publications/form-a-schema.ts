import * as z from "zod"

const formASchema = z.object({

  //A.1 Publication Details
  pubType: z.enum(["book", "bookChapter", "journalArticle", "peerReviewed", "conferencePaper", "other"], {
    message: "Select a publication type.",
  }),
  otherPubTypeText: z
    .string()
    .optional(),
  pubTitle: z
    .string()
    .min(1, "Title is required"),
  pubAuthors: z
    .string()
    .min(1, "Author(s) required"),
  dateToggle: z
    .enum(["year", "date"]),
  yearPublished: z.coerce.number().min(1900).max(2199).optional(),
  datePublished: z.date().optional(),

  //A.2 Journal / Publisher Information (PBMS Form G)
  pubName: z.string().min(1, "Publication name is required"),
  pubrName: z
    .string()
    .min(1, "Publisher name is required"),
  pubrType: z
    .enum(["Commercial", "Learned Society / Association", "University Press"]),
  pubrLocr: z
   .enum(["Local", "International"]),
  edrName: z
    .string()
    .optional(),
  vonumInum: z
    .string()
    .optional(),
  doiUrl: z
    .string()
    .url()
    .or(z
      .literal("")),
  isbn: z
    .string()
    .optional(),

  //A.3 Indexing / Accreditation
  isIsi: z
    .enum(["Yes", "No"]),
  scopus: z
    .enum(["Yes", "No"]),
  pubmedMedline: z
    .enum(["Yes", "No"]),
  isChedRecognized: z
    .enum(["Yes", "No"]),
  peerRev: z
    .enum(["Yes", "No"]),
  otherDB: z
   .string().optional(),
  citationNum: z
    .coerce.number().nonnegative(),
  
  // A.4 Supporting Documents
  pubProof: z
    .any()
    .refine((files) => files?.length > 0, "Proof of Publication is required."),
  pubUtilProof: z
    .any()
    .optional(), // Set as optional or required based on your needs
  pubSupRemarks: z
   .string().optional(),
  pubRelatedKRAs: z
    .string().optional(),
});

type FormValues = z.infer<typeof formASchema>

export { formASchema, type FormValues }