import {
  formDSchema,
  type FormValues
} from "@/features/forms/form-d/form-d-schema"
import { formFields } from "@/features/forms/form-d/form-d-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormDRecord, useFormDRecord } from "@/hooks/forms/use-form-d-mutation"
import { deleteReportEntry } from "@/api/entries"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormDPatents() {
  const navigate = useNavigate()
  const createFormDRecord = useCreateFormDRecord()
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0

  const { data: existingData, isLoading: isLoadingExisting } = useFormDRecord(editingEntryId)

  const onSubmit = async (data: FormValues) => {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    await createFormDRecord.mutateAsync({
      values: data,
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
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION D — PATENTS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formDSchema}
        formFields={formFields}
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
