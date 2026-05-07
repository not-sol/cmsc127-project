import type { FormValues } from "@/features/forms/form-d/form-d-schema"
import type { FormFieldConfig } from "@/features/forms/form-types"

export const formFields: FormFieldConfig<FormValues>[] = [
  // D.1 Patent Identification
  { //researchTitle3
    type: "text",
    name: "researchTitle3",
    label: "Linked Research (from Section B)",
    placeholder: "Enter the title of the parent research project",
  },
  { //patentTitle
    type: "text",
    name: "patentTitle",
    label: "Title of Patent",
  },
  { //patentType
    type: "radio",
    name: "patentType",
    label: "Type of Patent",
    options: [
      { value: "invention", label: "Invention" },
      { value: "utilityModel", label: "Utility Model" },
      { value: "industrialDesign", label: "Industrial Design" },
    ],
  },

  // D.2 Application & Grant Details
  { //aplNum
    type: "text",
    name: "aplNum",
    label: "Application Number",
  },
  { //aplInventors
    type: "text",
    name: "aplInventors",
    label: "Name of Inventor(s)",
    placeholder: "Separate multiple inventors with semicolons",
  },
  { //aplApplicants
    type: "text",
    name: "aplApplicants",
    label: "Name of Applicant / Owner(s)",
  },
  { //unexaminedApplicationDate
    type: "date-picker",
    name: "unexaminedApplicationDate",
    label: "Date of Publication of Unexamined Application",
    placeholder: "MM/DD/YYYY",
  },
  { //grantPatentDate
    type: "date-picker",
    name: "grantPatentDate",
    label: "Date of Grant of Patent",
    placeholder: "MM/DD/YYYY — leave blank if not yet granted",
  },
  { //regisNum
    type: "text",
    name: "regisNum",
    label: "Registration Number",
    placeholder: "Leave blank if not yet granted",
  },
  { //commercialProduct
    type: "text",
    name: "commercialProduct",
    label: "Name of Commercial Product",
    placeholder: "If applicable",
  },
  { //utilType
    type: "radio",
    name: "utilType",
    label: "Utilization of Research Output",
    options: [
      { value: "nAUtil", label: "Not applicable as utilized output" },
      { value: "techDev", label: "For development of technology" },
      { value: "servProv", label: "For service provision" },
      { value: "endProduct", label: "As an end-product in itself" },
    ],
  },


  // D.3  Supporting Documents
  { //patentAttachments
    type: "file",
    name: "patentAttachments",
    label: "Attachments",
    description: "Upload patent application or grant certificate",
  },
  { //patentRemarks
    type: "textarea",
    name: "patentRemarks",
    label: "Remarks",
  },
]
