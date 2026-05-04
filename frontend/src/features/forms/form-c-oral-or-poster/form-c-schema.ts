import * as z from "zod"

const formCSchema = z.object({

  //C.1 Research Identification
  researchTitle2: z
  .enum([""], {
    message: "Linked research title is required.",
  }),
  titlePresented: z
    .string()
    .min(1, "Title of paper presented is required."),
  presentationType: z
  .enum(["oral", "poster"]),
  eventType: z
  .enum(["conference", "forum","seminar","workshop"]),

  //C.2  Duration & Status
  eventTitle: z
    .string()
    .min(1, "Title of Conference / Event is required."),
  organizerName: z
    .string()
    .min(1, "Name of organizer is required."),
  conferenceLocation: z
  .enum(["institutionalInhouse", "localRegional", "national", "international"]),
  conferenceAddress: z
   .string()
   .min(1, "Conference/Event address is required."),
  conferenceStartDate: z.date({
    message: "Start date is required.",
  }),
  conferenceEndDate: z.date({
    message: "End date is required.",
  }),
  presentationDate: z.date({
    message: "Presentation date is required.",
  }),
  
  // C.3 Supporting Documents
  presentationAttachments: z
    .any()
    .refine((files) => files?.length > 0, "At least one (1) attachment is required."),
  presentationRemarks: z
   .string().optional(),
  presentationRelatedKRAs: z
    .string().optional(),
});

type FormValues = z.infer<typeof formCSchema>

export { formCSchema, type FormValues }