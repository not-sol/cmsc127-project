import {
  formDSchema,
  type FormValues
} from "@/features/forms/form-d/form-d-schema"
import { formFields } from "@/features/forms/form-d/form-d-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormDRecord, useFormDRecord } from "@/hooks/forms/use-form-d-mutation"
import { useFormBResearches } from "@/hooks/forms/use-form-b-mutation"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useMemo } from "react"

export default function FormDPatents() {
  const navigate = useNavigate()
  const createFormDRecord = useCreateFormDRecord()
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormDRecord(editingEntryId)
  const { data: researches, isLoading: isLoadingResearches } = useFormBResearches()

  const updatedFormFields = useMemo(() => {
    return formFields.map((field) => {
      if (field.name === "researchTitle3" && field.type === "select") {
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

    const result = await createFormDRecord.mutateAsync({
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
      {/* <h2 className="text-xl font-bold mb-4">SECTION D — PATENTS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formDSchema}
        formFields={updatedFormFields}
        defaultValues={existingData || {
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
          patentRemarks: "",
        }}
        onSubmit={onSubmit}
        submitLabel={isEditing ? "Update" : "Submit"}
        submitError={getMutationErrorMessage(createFormDRecord.error)}
        submitSuccess={
          createFormDRecord.isSuccess
            ? `Patent entry ${isEditing ? "updated" : "created"} successfully.`
            : undefined
        }
      />
    </div>
  )
}
