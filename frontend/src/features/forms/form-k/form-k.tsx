import {
  formKOtherSchema,
  type FormKOtherValues,
} from "@/features/forms/form-k/form-k-schema"
import { formKOtherFields } from "@/features/forms/form-k/form-k-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormKRecord, useFormKRecord } from "@/hooks/forms/use-form-k-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function FormKOther() {
  const createFormKRecord = useCreateFormKRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0

  const { data: existingData, isLoading: isLoadingExisting } = useFormKRecord(editingEntryId)

  async function onSubmit(data: FormKOtherValues) {
    try {
      if (isEditing) {
        await deleteReportEntry(editingEntryId)
      }

      await createFormKRecord.mutateAsync({
        values: data,
        submittedBy: userId,
      })

      navigate("/reports/create-report")
    } catch (error) {
      console.error("Form submission failed:", error)
      // Error is handled by the mutation and displayed via submitError prop
    }
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
      <DynamicForm<FormKOtherValues>
        formSchema={formKOtherSchema}
        formFields={formKOtherFields}
        defaultValues={existingData || {
          title: "",
        description: "",
        date: undefined,
        endDate: undefined,
        supportingDocuments: [],
      }}
      onSubmit={onSubmit}
      //title="Form K: Other Accomplishment"
      description="Use this form to record significant accomplishments that do not fall under a predefined category. Provide a clear description and upload any relevant supporting documents."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormKRecord.error)}
      submitSuccess={
        createFormKRecord.isSuccess
          ? `Other accomplishment entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
