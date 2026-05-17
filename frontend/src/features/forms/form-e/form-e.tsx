import { formESchema, type FormEValues } from "@/features/forms/form-e/form-e-schema"
import { formEFields } from "@/features/forms/form-e/form-e-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormERecord, useFormERecord } from "@/hooks/forms/use-form-e-mutation"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormE() {
  const navigate = useNavigate()
  const createFormERecord = useCreateFormERecord()
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormERecord(editingEntryId)

  async function onSubmit(data: FormEValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormERecord.mutateAsync({
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
      <DynamicForm<FormEValues>
            formSchema={formESchema}
            formFields={formEFields}
            defaultValues={existingData || {
              linkedResearch: "",
              titleOfArtisticWork: "",
              typeOfOutput: undefined,
              otherType: "",
              typeOfPublicEvent: undefined,
              titleOfEvent: "",
              organizer: "",
              locationScope: undefined,
              eventVenueCityCountry: "",
              eventStartDate: undefined,
              eventEndDate: undefined,
              firstShownReleasedDate: undefined,
              utilization: undefined,
              proofOfResearchOutput: [],
              proofOfUtilization: [],
              remarks: "",
              relatedKras: "",
            }}
            onSubmit={onSubmit}
            // title="Form E: Creative Work Output / Other Research Output"
            description="Use this form to record creative or research outputs not categorized as publications, paper presentations, or patents. The output must have been exposed in a public event (exhibition, performance, or publication)."
            submitLabel={isEditing ? "Update" : "Submit"}
            submitError={getMutationErrorMessage(createFormERecord.error)}
            submitSuccess={
              createFormERecord.isSuccess
                ? `Creative work output entry ${isEditing ? "updated" : "created"} successfully.`
                : undefined
            }
          />
    </div>
  )
}
