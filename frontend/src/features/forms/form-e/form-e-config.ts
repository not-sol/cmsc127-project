import type { FormEValues } from "@/features/forms/form-e/form-e-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formEFields: FormFieldConfig<FormEValues>[] = [
  // ── E.1 Output Details ────────────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_e1",
    label: "E.1 Output Details",
    description:
      "Provide details about the creative or research output. Include outputs not categorized as publications, paper presentations, or patents.",
  },
  {
    type: "text",
    name: "linkedResearch",
    label: "Linked Research",
    placeholder: "Enter the title of the parent research project",
    description:
      "Select the title of the parent research project this output is linked to.",
  },
  {
    type: "text",
    name: "titleOfArtisticWork",
    label: "Title of Artistic / Creative Work",
    placeholder: "Enter the title of the artistic or creative work",
  },
  {
    type: "radio",
    name: "typeOfOutput",
    label: "Type of Output",
    options: [
      {
        value: "performing_arts",
        label: "Performing Arts (Dance / Music / Theater)",
      },
      {
        value: "visual_arts",
        label: "Visual Arts (Painting / Sculpture / Film / etc.)",
      },
      { value: "literary_work", label: "Literary Work" },
      { value: "textbook", label: "Textbook" },
      { value: "computer_software", label: "Computer Software" },
      {
        value: "product_process_method_technology_innovation",
        label: "Product / Process / Method / Technology Innovation",
      },
    ],
    otherOption: {
      name: "otherType",
      label: "Other (specify)",
      placeholder: "Specify the type of output",
      clearOnDeselect: true,
    },
  },

  // ── E.2 Public Event Details ──────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_e2",
    label: "E.2 Public Event Details",
    description:
      "The output must have been exposed in a public event (exhibition, performance, or publication).",
  },
  {
    type: "radio",
    name: "typeOfPublicEvent",
    label: "Type of Public Event",
    options: [
      { value: "exhibition", label: "Exhibition" },
      { value: "performance", label: "Performance" },
      { value: "publication", label: "Publication" },
    ],
  },
  {
    type: "text",
    name: "titleOfEvent",
    label: "Title of Event",
    placeholder: "Enter the title of the event",
  },
  {
    type: "text",
    name: "organizer",
    label: "Name of Organizer / Curator / Publisher",
    placeholder: "Enter the name of the organizer, curator, or publisher",
  },
  {
    type: "radio",
    name: "locationScope",
    label: "Location / Scope of Event",
    options: [
      { value: "institutional_in_house", label: "Institutional / In-House" },
      { value: "local_regional", label: "Local / Regional" },
      { value: "national", label: "National" },
      { value: "international", label: "International" },
    ],
  },
  {
    type: "text",
    name: "eventVenueCityCountry",
    label: "Event Venue, City, and Country",
    placeholder: "e.g., National Museum, Manila, Philippines",
  },
  {
    type: "date-picker",
    name: "eventStartDate",
    label: "Event Start Date",
    description: "Select the start date of the event (MM/DD/YYYY).",
    optional: true,
  },
  {
    type: "date-picker",
    name: "eventEndDate",
    label: "Event End Date",
    description: "Select the end date of the event (MM/DD/YYYY).",
    optional: true,
  },
  {
    type: "date-picker",
    name: "firstShownReleasedDate",
    label: "Date Output Was First Shown / Released",
    description:
      "Select the date the output was first shown or released (MM/DD/YYYY).",
    optional: true,
  },
  {
    type: "radio",
    name: "utilization",
    label: "Utilization of Research Output",
    options: [
      { value: "not_applicable", label: "Not applicable" },
      {
        value: "development_of_technology",
        label: "For development of technology",
      },
      { value: "service_provision", label: "For service provision" },
      { value: "end_product", label: "As an end-product in itself" },
    ],
  },

  // ── E.3 Supporting Documents ──────────────────────────────────────────────
  {
    type: "section-header",
    name: "_section_e3",
    label: "E.3 Supporting Documents",
  },
  {
    type: "file",
    name: "proofOfResearchOutput",
    label: "Proof of Research Output",
    description:
      "Upload announcement, programme, poster, or publicity materials.",
    multiple: true,
    allowedMimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10,
  },
  {
    type: "file",
    name: "proofOfUtilization",
    label: "Proof of Utilization",
    description:
      "Upload sales data, IPRS, testimonials, or certification (if applicable).",
    multiple: true,
    allowedMimeTypes: [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10,
    optional: true,
  },
  {
    type: "textarea",
    name: "remarks",
    label: "Remarks",
    placeholder: "Enter any additional remarks or notes",
    optional: true,
  },
  {
    type: "text",
    name: "relatedKras",
    label: "Related KRAs / Sub-activities",
    placeholder: "List related KRAs or sub-activities",
    optional: true,
  },
]
