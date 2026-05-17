import {
  formJAuthorshipSchema,
  type FormJAuthorshipValues,
} from "@/features/forms/form-j/form-j-schema"
import { formJAuthorshipFields } from "@/features/forms/form-j/form-j-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormJRecord, useFormJRecord } from "@/hooks/forms/use-form-j-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function FormJAuthorship() {
  const createFormJRecord = useCreateFormJRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormJRecord(editingEntryId)

  async function onSubmit(data: FormJAuthorshipValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormJRecord.mutateAsync({
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
      <DynamicForm<FormJAuthorshipValues>
        formSchema={formJAuthorshipSchema}
        formFields={formJAuthorshipFields}
        defaultValues={existingData || {
          titleOfMaterial: "",
        authors: "",
        year: "",
        attachments: [],
        remarks: "",
        relatedKRAs: "",
      }}
      onSubmit={onSubmit}
      //title="Form J: Authorships (Audio-Visual Materials / Learning Objects / Manuals)"
      description="Use this form to record authorship of instructional materials that do not qualify as publications, such as laboratory manuals, lecture manuals, and learning objects."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormJRecord.error)}
      submitSuccess={
        createFormJRecord.isSuccess
          ? `Authorship entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
