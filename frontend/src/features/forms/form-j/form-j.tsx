import {
  formJAuthorshipSchema,
  type FormJAuthorshipValues,
} from "@/features/forms/form-j/form-j-schema"
import { formJAuthorshipFields } from "@/features/forms/form-j/form-j-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormJRecord } from "@/hooks/forms/use-form-j-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormJAuthorship() {
  const createFormJRecord = useCreateFormJRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormJAuthorshipValues) {
    await createFormJRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormJAuthorshipValues>
      formSchema={formJAuthorshipSchema}
      formFields={formJAuthorshipFields}
      defaultValues={{
        titleOfMaterial: "",
        authors: "",
        year: "",
        attachments: [],
        remarks: "",
        relatedKRAs: "",
      }}
      onSubmit={onSubmit}
      title="Form J: Authorships (Audio-Visual Materials / Learning Objects / Manuals)"
      description="Use this form to record authorship of instructional materials that do not qualify as publications, such as laboratory manuals, lecture manuals, and learning objects."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormJRecord.error)}
      submitSuccess={
        createFormJRecord.isSuccess ? "Authorship entry created successfully." : undefined
      }
    />
  )
}
