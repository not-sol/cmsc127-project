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
  // dateToggle: z
  //   .enum(["year", "date"]),
  // yearPublished: z.coerce.number().min(1900).max(2199).optional(),
  // datePublished: z.date().optional(),
  pubDate: z
    .string()
    .min(4, "Date or Year is required")
    .refine((val) => {
      const trimmed = val.trim();
      const isYearOnly = /^\d{4}$/.test(trimmed);
      const isFullDate = !isNaN(Date.parse(trimmed));
      return isYearOnly || isFullDate;
    }, "Please enter a valid 4-digit year or a full date")

    // THIS IS THE NEW PART:
    .transform((val) => {
      const trimmed = val.trim();

      // 1. If they only typed a year (e.g., "2024"), just return the year.
      // (Or change this to "01/01/2024" if you strictly need a full date).
      if (/^\d{4}$/.test(trimmed)) {
        return trimmed;
      }

      // 2. If it's a full date (e.g. "2024-10-12" or "Oct 12 2024"), 
      // convert it into a Date object, then format it as MM/DD/YYYY.
      const dateObj = new Date(trimmed);

      // Get month, day, year (adding 1 to month because January is 0)
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const yyyy = dateObj.getFullYear();

      return `${mm}/${dd}/${yyyy}`;
    }),

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
    .string().optional(),

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
