import {
  formCSchema,
  type FormValues
} from "@/features/forms/form-c/form-c-schema"
import { formFields } from "@/features/forms/form-c/form-c-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormCRecord, useFormCRecord } from "@/hooks/forms/use-form-c-mutation"
import { useFormBResearches } from "@/hooks/forms/use-form-b-mutation"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMemo } from "react"

export default function FormCOralOrPoster() {
  const navigate = useNavigate()
  const createFormCRecord = useCreateFormCRecord()
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormCRecord(editingEntryId)
  const { data: researches, isLoading: isLoadingResearches } = useFormBResearches()

  const updatedFormFields = useMemo(() => {
    return formFields.map((field) => {
      if (field.name === "researchTitle2" && field.type === "select") {
        return {
          ...field,
          options: researches || [],
        }
      }
      return field
    })
  }, [researches])

  const onSubmit = async (data: FormValues) => {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormCRecord.mutateAsync({
      values: data,
      reportId,
    })
    navigate(getReportEditorPath(result.report_id))
  }

  if ((isEditing && isLoadingExisting) || isLoadingResearches) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* <h2 className="text-xl font-bold mb-4">SECTION C — PAPER PRESENTATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formCSchema}
        formFields={updatedFormFields}
        defaultValues={existingData || {
          researchTitle2: "",
          titlePresented: "",
          presentationType: "oral",
          eventType: "conference",
          eventTitle: "",
          organizerName: "",
          conferenceLocation: "institutionalInhouse",
          conferenceAddress: "",
          conferenceStartDate: new Date(),
          conferenceEndDate: undefined,
          presentationDate: new Date(),
          presentationRemarks: "",
          presentationRelatedKRAs: "",
        }}
        onSubmit={onSubmit}
        submitLabel={isEditing ? "Update" : "Submit"}
        submitError={getMutationErrorMessage(createFormCRecord.error)}
        submitSuccess={
          createFormCRecord.isSuccess
            ? `Presentation entry ${isEditing ? "updated" : "created"} successfully.`
            : undefined
        }
      />
    </div>
  )
}
