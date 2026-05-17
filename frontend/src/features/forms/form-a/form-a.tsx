import {
  formASchema,
  type FormValues
} from "@/features/forms/form-a/form-a-schema"
import { formFields } from "@/features/forms/form-a/form-a-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormARecord, useFormARecord } from "@/hooks/forms/use-form-a-mutation"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormAPublications() {
  const navigate = useNavigate()
  const createFormARecord = useCreateFormARecord()
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormARecord(editingEntryId)

  const onSubmit = async (data: FormValues) => {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormARecord.mutateAsync({
      values: data,
      reportId,
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
      {/* <h2 className="text-xl font-bold mb-4">SECTION A — PUBLICATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formASchema}
        formFields={formFields}
        defaultValues={existingData || {
          pubType: "book",
          pubTitle: "",
          pubAuthors: "",
          pubDate: "",
          pubName: "",
          pubrName: "",
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
        submitLabel={isEditing ? "Update" : "Submit"}
        submitError={getMutationErrorMessage(createFormARecord.error)}
        submitSuccess={
          createFormARecord.isSuccess
            ? `Publication entry ${isEditing ? "updated" : "created"} successfully.`
            : undefined
        }
      />
    </div>
  )
}
