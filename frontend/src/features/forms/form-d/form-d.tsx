import {
  formDSchema,
  type FormValues
} from "@/features/forms/form-d/form-d-schema"
import { formFields } from "@/features/forms/form-d/form-d-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormDRecord } from "@/hooks/forms/use-form-d-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormDPatents() {
  const createFormDRecord = useCreateFormDRecord()
  const userId = useAuthStore((state) => state.user?.id)

  const onSubmit = async (data: FormValues) => {
    await createFormDRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION C — ORAL PAPER OR POSTER PRESENTATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formDSchema}
        formFields={formFields}
        defaultValues={{
          researchTitle3: "",
          patentTitle: "",
          patentType: "invention",
          aplNum: "",
          aplInventors: "",
          aplApplicants: "",
          unexaminedApplicationDate: new Date(),
          grantPatentDate: undefined,
          regisNum: "",
          commercialProduct: "",
          utilType: "nAUtil",
        }}
        onSubmit={onSubmit}
        submitError={getMutationErrorMessage(createFormDRecord.error)}
        submitSuccess={
          createFormDRecord.isSuccess ? "Patent entry created successfully." : undefined
        }
      />
    </div>
  )
}
