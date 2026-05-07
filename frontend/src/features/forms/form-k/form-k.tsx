import {
  formKOtherSchema,
  type FormKOtherValues,
} from "@/features/forms/form-k/form-k-schema"
import { formKOtherFields } from "@/features/forms/form-k/form-k-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormKRecord } from "@/hooks/forms/use-form-k-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormKOther() {
  const createFormKRecord = useCreateFormKRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormKOtherValues) {
    await createFormKRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormKOtherValues>
      formSchema={formKOtherSchema}
      formFields={formKOtherFields}
      defaultValues={{
        title: "",
        description: "",
        date: undefined,
        supportingDocuments: [],
      }}
      onSubmit={onSubmit}
      title="Form K: Other Accomplishment"
      description="Use this form to record significant accomplishments that do not fall under a predefined category. Provide a clear description and upload any relevant supporting documents."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormKRecord.error)}
      submitSuccess={
        createFormKRecord.isSuccess
          ? "Other accomplishment entry created successfully."
          : undefined
      }
    />
  )
}
