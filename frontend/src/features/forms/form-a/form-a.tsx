import {
  formASchema,
  type FormValues
} from "@/features/forms/form-a/form-a-schema"
import { formFields } from "@/features/forms/form-a/form-a-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormARecord } from "@/hooks/forms/use-form-a-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormAPublications() {
  const createFormARecord = useCreateFormARecord()
  const userId = useAuthStore((state) => state.user?.id)

  const onSubmit = async (data: FormValues) => {
    await createFormARecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION A — PUBLICATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formASchema}
        formFields={formFields}
        defaultValues={{
          pubType: "book",
          pubTitle: "",
          pubAuthors: "",
          pubDate: "",
          pubName: "",
          pubrType: "Commercial",
          pubrLocr: "Local",
          isIsi: "No",
          scopus: "No",
          pubmedMedline: "No",
          isChedRecognized: "No",
          peerRev: "No",
          citationNum: "0",
        }}
        onSubmit={onSubmit}
        submitError={getMutationErrorMessage(createFormARecord.error)}
        submitSuccess={
          createFormARecord.isSuccess ? "Publication entry created successfully." : undefined
        }
      />
    </div>
  )
}
