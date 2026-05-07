import { formFSchema, type FormFValues } from "@/features/forms/form-f/form-f-schema"
import { formFFields } from "@/features/forms/form-f/form-f-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormFRecord } from "@/hooks/forms/use-form-f-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormF() {
  const createFormFRecord = useCreateFormFRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormFValues) {
    await createFormFRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormFValues>
      formSchema={formFSchema}
      formFields={formFFields}
      defaultValues={{
        type: "",
        awardGrantTitle: "",
        sourceAwardingBody: "",
        details: "",
        startDate: undefined,
        endDate: undefined,
        attachments: [],
        remarks: "",
        relatedKras: "",
      }}
      onSubmit={onSubmit}
      title="Form F: Awards / Grants"
      description="Use this form to record awards and grants received. Awards and grants are recorded for completeness and support performance narratives."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormFRecord.error)}
      submitSuccess={
        createFormFRecord.isSuccess ? "Award or grant entry created successfully." : undefined
      }
    />
  )
}
