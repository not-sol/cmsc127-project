import { formGSchema, type FormGValues } from "@/features/forms/form-g/form-g-schema"
import { formGFields } from "@/features/forms/form-g/form-g-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormGRecord, useFormGRecord } from "@/hooks/forms/use-form-g-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormG() {
  const navigate = useNavigate()
  const createFormGRecord = useCreateFormGRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormGRecord(editingEntryId)

  async function onSubmit(data: FormGValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormGRecord.mutateAsync({
      values: data,
      reportId,
      submittedBy: userId,
    })
    navigate(getReportEditorPath(result.report_id))
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
      <DynamicForm<FormGValues>
        formSchema={formGSchema}
        formFields={formGFields}
        defaultValues={existingData || {
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
      //title="Form G: Training / Workshop / Seminar Conducted"
      description="Use this form to record training activities conducted by faculty. Trainings attended as a participant should be recorded in Section I (Other Accomplishments)."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormGRecord.error)}
      submitSuccess={
        createFormGRecord.isSuccess
          ? `Training entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
