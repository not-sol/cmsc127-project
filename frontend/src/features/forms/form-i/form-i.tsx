import {
  formIPartnershipSchema,
  type FormIPartnershipValues,
} from "@/features/forms/form-i/form-i-schema"
import { formIPartnershipFields } from "@/features/forms/form-i/form-i-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormIRecord } from "@/hooks/forms/use-form-i-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormIPartnership() {
  const createFormIRecord = useCreateFormIRecord()
  const userId = useAuthStore((state) => state.user?.id)

  async function onSubmit(data: FormIPartnershipValues) {
    await createFormIRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
  }

  return (
    <DynamicForm<FormIPartnershipValues>
      formSchema={formIPartnershipSchema}
      formFields={formIPartnershipFields}
      defaultValues={{
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
        moaDocument: [],
        remarks: "",
      }}
      onSubmit={onSubmit}
      title="Form I: Partnership with Stakeholders"
      description="Use this form to record formal partnerships established with stakeholders through a MOA, MOU, or similar partnership agreement recognized by UP."
      submitLabel="Submit"
      submitError={getMutationErrorMessage(createFormIRecord.error)}
      submitSuccess={
        createFormIRecord.isSuccess ? "Partnership entry created successfully." : undefined
      }
    />
  )
}
