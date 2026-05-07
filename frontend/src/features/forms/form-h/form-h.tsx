import { formHSchema, type FormHValues } from "@/features/forms/form-h/form-h-schema"
import { formHFields } from "@/features/forms/form-h/form-h-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormHRecord } from "@/hooks/forms/use-form-h-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormH() {
  const createFormHRecord = useCreateFormHRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormHValues) {
    await createFormHRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormHValues>
      formSchema={formHSchema}
      formFields={formHFields}
      defaultValues={{
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
      title="Form H: Extension Program"
      description="Use this form to record extension programs conducted by the department. An Extension Program must be part of the approved Extension Work Agenda and must be a holistic, integrated program — not individual extension activities."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormHRecord.error)}
      submitSuccess={
        createFormHRecord.isSuccess
          ? "Extension program entry created successfully."
          : undefined
      }
    />
  )
}
