import * as z from "zod"

function requiredFiles(message: string) {
  return z.any().refine((value) => {
    if (!value) return false
    if (value instanceof File) return true
    if (Array.isArray(value)) return value.some((file) => file instanceof File)
    if (typeof FileList !== "undefined" && value instanceof FileList) {
      return value.length > 0
    }
    if (typeof value === "string") return value.trim().length > 0
    return false
  }, message)
}

const formESchema = z.object({
  // E.1 Output Details
  linkedResearch: z.string().min(1, "Linked research is required."),
  titleOfArtisticWork: z
    .string()
    .min(1, "Title of artistic/creative work is required.")
    .max(200, "Title must be at most 200 characters."),
  typeOfOutput: z.enum(
    [
      "performing_arts",
      "visual_arts",
      "literary_work",
      "textbook",
      "computer_software",
      "product_process_method_technology_innovation",
      "other",
    ],
    { message: "Type of output is required." }
  ),
  otherType: z.string().optional(),

  // E.2 Public Event Details
  typeOfPublicEvent: z.enum(["exhibition", "performance", "publication"], {
    message: "Type of public event is required.",
  }),
  titleOfEvent: z
    .string()
    .min(1, "Title of event is required.")
    .max(200, "Title must be at most 200 characters."),
  organizer: z.string().min(1, "Organizer is required."),
  locationScope: z.enum(
    ["institutional_in_house", "local_regional", "national", "international"],
    { message: "Location / scope is required." }
  ),
  eventVenueCityCountry: z
    .string()
    .min(1, "Event venue, city, and country is required."),
  eventStartDate: z.date({ message: "Event start date is required." }),
  eventEndDate: z.date({ message: "Event end date is required." }),
  firstShownReleasedDate: z.date({
    message: "Date first shown / released is required.",
  }),
  utilization: z.enum(
    [
      "not_applicable",
      "development_of_technology",
      "service_provision",
      "end_product",
    ],
    { message: "Utilization of research output is required." }
  ),

  // E.3 Supporting Documents
  proofOfResearchOutput: requiredFiles("At least one proof of research output file is required."),
  proofOfUtilization: z.any().optional(),
  remarks: z.string().optional(),
  relatedKras: z.string().optional(),
}).refine(
  (values) => values.typeOfOutput !== "other" || Boolean(values.otherType?.trim()),
  {
    message: "Please specify the other type of output.",
    path: ["otherType"],
  }
)

type FormEValues = z.infer<typeof formESchema>

export { formESchema, type FormEValues }
