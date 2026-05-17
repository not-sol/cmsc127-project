import { formFSchema, type FormFValues } from "@/features/forms/form-f/form-f-schema"
import { formFFields } from "@/features/forms/form-f/form-f-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormFRecord, useFormFRecord } from "@/hooks/forms/use-form-f-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormF() {
  const navigate = useNavigate()
  const createFormFRecord = useCreateFormFRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormFRecord(editingEntryId)

  async function onSubmit(data: FormFValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    await createFormFRecord.mutateAsync({
      values: data,
      reportId,
      submittedBy: userId,
    })

    navigate(getReportEditorPath(reportId))
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
    <DynamicForm<FormFValues>
      formSchema={formFSchema}
      formFields={formFFields}
      defaultValues={existingData || {
        type: "",
        awardGrantTitle: "",
        sourceAwardingBody: "",
        details: "",
        startDate: undefined,
        endDate: undefined,
        attachments: undefined,
        remarks: "",
        relatedKras: "",
      }}
      onSubmit={onSubmit}
      //title="Form F: Awards / Grants"
      description="Use this form to record awards and grants received. Awards and grants are recorded for completeness and support performance narratives."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormFRecord.error)}
      submitSuccess={
        createFormFRecord.isSuccess
          ? `Award or grant entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
