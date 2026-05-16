import {
  formBSchema,
  type FormValues
} from "@/features/forms/form-b/form-b-schema"
import { formFields } from "@/features/forms/form-b/form-b-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormBRecord, useFormBRecord } from "@/hooks/forms/use-form-b-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormBGrantsAndFellowships() {
  const navigate = useNavigate()
  const createFormBRecord = useCreateFormBRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0

  const { data: existingData, isLoading: isLoadingExisting } = useFormBRecord(editingEntryId)

  const onSubmit = async (data: FormValues) => {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    await createFormBRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })

    navigate("/reports/create-report")
  }

  if (isEditing && isLoadingExisting) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-muted-foreground animate-pulse">Loading existing entry...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* <h2 className="text-xl font-bold mb-4">SECTION B — GRANTS AND FELLOWSHIPS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formBSchema}
        formFields={formFields}
        defaultValues={existingData || {
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
          supportingAttachments: undefined,
          researchRemarks: "",
          researchRelatedKRAs: "",
        }}
        onSubmit={onSubmit}
        submitLabel={isEditing ? "Update" : "Submit"}
        submitError={getMutationErrorMessage(createFormBRecord.error)}
        submitSuccess={
          createFormBRecord.isSuccess
            ? `Research grant or fellowship entry ${isEditing ? "updated" : "created"} successfully.`
            : undefined
        }
      />
    </div>
  )
}
