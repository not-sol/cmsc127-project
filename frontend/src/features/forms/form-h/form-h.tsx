import { formHSchema, type FormHValues } from "@/features/forms/form-h/form-h-schema"
import { formHFields } from "@/features/forms/form-h/form-h-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormHRecord, useFormHRecord } from "@/hooks/forms/use-form-h-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function FormH() {
  const navigate = useNavigate()
  const createFormHRecord = useCreateFormHRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0

  const { data: existingData, isLoading: isLoadingExisting } = useFormHRecord(editingEntryId)

  async function onSubmit(data: FormHValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    await createFormHRecord.mutateAsync({
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
      <DynamicForm<FormHValues>
        formSchema={formHSchema}
        formFields={formHFields}
        defaultValues={existingData || {
          contributingUnit: "",
        title: "",
        trainingCourses: "",
        technicalAdvisoryService: "",
        informationDissemination: "",
        consultancy: "",
        communityOutreach: "",
        technologyTransfer: "",
        organizing: "",
        academicDegreePrograms: "",
        scopeOfWork: "",
        startDate: undefined,
        endDate: undefined,
        targetBeneficiary: "",
        numberOfBeneficiaries: "",
        fundingSource: "",
        programDocuments: [],
        remarks: "",
      }}
      onSubmit={onSubmit}
      //title="Form H: Extension Program"
      description="Use this form to record extension programs conducted by the department. An Extension Program must be part of the approved Extension Work Agenda and must be a holistic, integrated program — not individual extension activities."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormHRecord.error)}
      submitSuccess={
        createFormHRecord.isSuccess
          ? `Extension program entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
