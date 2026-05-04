import { formESchema, type FormEValues } from "@/features/forms/form-e/form-e-schema"
import { formEFields } from "@/features/forms/form-e/form-e-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormE() {
  function onSubmit(data: FormEValues) {
    console.log("Form E Creative Work Output submitted:", data)
  }

  return (
    <DynamicForm<FormEValues>
      formSchema={formESchema}
      formFields={formEFields}
      defaultValues={{
        linkedResearch: "",
        titleOfArtisticWork: "",
        typeOfOutput: "",
        otherType: "",
        typeOfPublicEvent: "",
        titleOfEvent: "",
        organizer: "",
        locationScope: "",
        eventVenueCityCountry: "",
        eventStartDate: undefined,
        eventEndDate: undefined,
        firstShownReleasedDate: undefined,
        utilization: "",
        proofOfResearchOutput: [],
        proofOfUtilization: [],
        remarks: "",
        relatedKras: "",
      }}
      onSubmit={onSubmit}
      title="Form E: Creative Work Output / Other Research Output"
      description="Use this form to record creative or research outputs not categorized as publications, paper presentations, or patents. The output must have been exposed in a public event (exhibition, performance, or publication)."
      submitLabel="Submit"
    />
  )
}
