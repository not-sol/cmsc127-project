import {
  formIPartnershipSchema,
  type FormIPartnershipValues,
} from "@/features/forms/form-i/form-i-schema"
import { formIPartnershipFields } from "@/features/forms/form-i/form-i-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormIRecord, useFormIRecord } from "@/hooks/forms/use-form-i-mutation"
import { useAuthStore } from "@/store/auth-store"
import { deleteReportEntry } from "@/api/entries"
import { getReportEditorPath, getReportIdFromSearchParams } from "@/features/forms/report-navigation"
import { useSearchParams, useNavigate } from "react-router-dom"

export default function FormIPartnership() {
  const createFormIRecord = useCreateFormIRecord()
  const userId = useAuthStore((state) => state.user?.id)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editingEntryId = Number(searchParams.get("entryId"))
  const isEditing = Number.isFinite(editingEntryId) && editingEntryId > 0
  const reportId = getReportIdFromSearchParams(searchParams)

  const { data: existingData, isLoading: isLoadingExisting } = useFormIRecord(editingEntryId)

  async function onSubmit(data: FormIPartnershipValues) {
    if (isEditing) {
      await deleteReportEntry(editingEntryId)
    }

    const result = await createFormIRecord.mutateAsync({
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
      <DynamicForm<FormIPartnershipValues>
        formSchema={formIPartnershipSchema}
        formFields={formIPartnershipFields}
        defaultValues={existingData || {
          contributingUnit: undefined,
        titleOfExtensionPartnership: "",
        scopeOfWork: "",
        nameOfPartnerStakeholder: "",
        stakeholderCategory: undefined,
        trainingCourses: undefined,
        technicalAdvisoryService: undefined,
        informationDissemination: undefined,
        consultancy: undefined,
        communityOutreach: undefined,
        technologyKnowledgeTransfer: undefined,
        organizingEvents: undefined,
        typeOfPartnershipAgreement: undefined,
        partnershipEffectivityStartDate: undefined,
        partnershipEffectivityEndDate: undefined,
        moaDocument: undefined,
        remarks: "",
      }}
      onSubmit={onSubmit}
      //title="Form I: Partnership with Stakeholders"
      description="Use this form to record formal partnerships established with stakeholders through a MOA, MOU, or similar partnership agreement recognized by UP."
      submitLabel={isEditing ? "Update" : "Submit"}
      submitError={getMutationErrorMessage(createFormIRecord.error)}
      submitSuccess={
        createFormIRecord.isSuccess
          ? `Partnership entry ${isEditing ? "updated" : "created"} successfully.`
          : undefined
      }
    />
    </div>
  )
}
