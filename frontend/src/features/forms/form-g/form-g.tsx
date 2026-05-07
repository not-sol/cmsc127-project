import { formGSchema, type FormGValues } from "@/features/forms/form-g/form-g-schema"
import { formGFields } from "@/features/forms/form-g/form-g-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormGRecord } from "@/hooks/forms/use-form-g-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormG() {
  const createFormGRecord = useCreateFormGRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormGValues) {
    await createFormGRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormGValues>
      formSchema={formGSchema}
      formFields={formGFields}
      defaultValues={{
        contributingUnit: "",
        typeOfActivity: "",
        title: "",
        venue: "",
        startDate: undefined,
        endDate: undefined,
        specialNotes: "",
        trainingHours: "",
        totalTrainees: "",
        fundingSource: "",
        sampleSize: "",
        responsesPoor: "",
        responsesFair: "",
        responsesSatisfactory: "",
        responsesVerySatisfactory: "",
        responsesOutstanding: "",
        isPartOfExtensionProgram: "",
        relatedExtensionProgram: "",
        attachments: [],
        remarks: "",
        relatedKras: "",
      }}
      onSubmit={onSubmit}
      title="Form G: Training / Workshop / Seminar Conducted"
      description="Use this form to record training activities conducted by faculty. Trainings attended as a participant should be recorded in Section I (Other Accomplishments)."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormGRecord.error)}
      submitSuccess={
        createFormGRecord.isSuccess ? "Training entry created successfully." : undefined
      }
    />
  )
}
