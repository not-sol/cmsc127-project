import type { FormValues } from "@/features/forms/form-c/form-c-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFields: FormFieldConfig<FormValues>[] = [
  // SECTION C.1
  { //researchTitle2
    type: "text",
    name: "researchTitle2",
    label: "Linked Research (from Section B)",
    placeholder: "Enter the title of the parent research project",
  },
  { //titlePresented
    type: "text",
    name: "titlePresented",
    label: "Title of Paper Presented",
  },
  { //presentationType
    type: "radio",
    name: "presentationType",
    label: "Presentation Type",
    options: [
      { value: "oral", label: "Oral Presentation" },
      { value: "poster", label: "Poster Presentation" },
    ],
  },
  { //eventType
    type: "radio",
    name: "eventType",
    label: ">Event Type",
    options: [
      { value: "conference", label: "Conference" },
      { value: "forum", label: "Forum" },
      { value: "seminar", label: "Seminar" },
      { value: "workshop", label: "Workshop" },
    ],
  },

  // SECTION C.2
  { //eventTitle
    type: "text",
    name: "eventTitle",
    label: "Title of Conference / Event",
  },
  { //organizerName
    type: "text",
    name: "organizerName",
    label: "Name of Organizer",
  },
  { //conferenceLocation
    type: "radio",
    name: "conferenceLocation",
    label: "Location / Scope of Conference",
    options: [
      { value: "institutionalInhouse", label: "Institutional / In-House" },
      { value: "localRegional", label: "Local / Regional" },
      { value: "national", label: "National" },
      { value: "international", label: "International" },
    ],
  },
  { //conferenceAddress
    type: "text",
    name: "conferenceAddress",
    label: "Venue, City, and Country",
  },
  { //conferenceStartDate
    type: "date-picker",
    name: "conferenceStartDate",
    label: "Conference Start Date",
    placeholder: "MM/DD/YYYY",
  },
  { //conferenceEndDate
    type: "date-picker",
    name: "conferenceEndDate",
    label: "Conference End Date",
    placeholder: "MM/DD/YYYY - leave blank if ongoing",
  },
  { //presentationDate
    type: "date-picker",
    name: "presentationDate",
    label: "Date of Presentation",
    placeholder: "MM/DD/YYYY",
  },


  // C.3  Supporting Documents
  { //presentationAttachments
    type: "file",
    name: "presentationAttachments",
    label: "Attachments",
    description: "Upload program, invitation, or certificate of presentation",
  },
  { //presentationRemarks
    type: "textarea",
    name: "presentationRemarks",
    label: "Remarks",
  },
  { //presentationRelatedKRAs
    type: "textarea",
    name: "presentationRelatedKRAs",
    label: "Related KRAs / Sub-activities",
  },
]
