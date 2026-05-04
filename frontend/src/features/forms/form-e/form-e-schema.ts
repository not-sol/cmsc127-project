import * as z from "zod"

const formESchema = z.object({
  // E.1 Output Details
  linkedResearch: z.string().min(1, "Linked research is required."),
  titleOfArtisticWork: z
    .string()
    .min(1, "Title of artistic/creative work is required.")
    .max(200, "Title must be at most 200 characters."),
  typeOfOutput: z.string().min(1, "Type of output is required."),
  otherType: z.string().optional(),

  // E.2 Public Event Details
  typeOfPublicEvent: z.string().min(1, "Type of public event is required."),
  titleOfEvent: z
    .string()
    .min(1, "Title of event is required.")
    .max(200, "Title must be at most 200 characters."),
  organizer: z.string().min(1, "Organizer is required."),
  locationScope: z.string().min(1, "Location / scope is required."),
  eventVenueCityCountry: z
    .string()
    .min(1, "Event venue, city, and country is required."),
  eventStartDate: z.date().optional(),
  eventEndDate: z.date().optional(),
  firstShownReleasedDate: z.date().optional(),
  utilization: z.string().min(1, "Utilization of research output is required."),

  // E.3 Supporting Documents
  proofOfResearchOutput: z.array(z.instanceof(File)),
  proofOfUtilization: z.array(z.instanceof(File)).optional(),
  remarks: z.string().optional(),
  relatedKras: z.string().optional(),
})

type FormEValues = z.infer<typeof formESchema>

export { formESchema, type FormEValues }
