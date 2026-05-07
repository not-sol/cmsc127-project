import { formESchema, type FormEValues } from "@/features/forms/form-e/form-e-schema"
import { formEFields } from "@/features/forms/form-e/form-e-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormERecord } from "@/hooks/forms/use-form-e-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormE() {
  const createFormERecord = useCreateFormERecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormEValues) {
    await createFormERecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
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
      submitError={getMutationErrorMessage(createFormERecord.error)}
      submitSuccess={
        createFormERecord.isSuccess
          ? "Creative work output entry created successfully."
          : undefined
      }
    />
  )
}
