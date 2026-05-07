import {
  formBSchema,
  type FormValues
} from "@/features/forms/form-b/form-b-schema"
import { formFields } from "@/features/forms/form-b/form-b-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormBRecord } from "@/hooks/forms/use-form-b-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormBGrantsAndFellowships() {
  const createFormBRecord = useCreateFormBRecord()
  const userId = useAuthStore((state) => state.user?.id)

  const onSubmit = async (data: FormValues) => {
    await createFormBRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION B — GRANTS AND FELLOWSHIPS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formBSchema}
        formFields={formFields}
        defaultValues={{
          contrUnit: "csmod",
          researchTitle: "",
          researchType: "basic",
          rStartDate: new Date(),
          rEndDate: undefined,
          researchTimeframeMonths: "",
          researcherNames: "",
          upSystemResearchGrantPesos: "0.00",
          externalFundingAmountPesos: "0.00",
          totalFundingPesos: "0.00",
          otherFundSource: "",
          majoritySource: "genFundCurYr",
        }}
        onSubmit={onSubmit}
        submitError={getMutationErrorMessage(createFormBRecord.error)}
        submitSuccess={
          createFormBRecord.isSuccess
            ? "Research grant or fellowship entry created successfully."
            : undefined
        }
      />
    </div>
  )
}
