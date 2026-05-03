import {
  formISchema,
  type FormIValues,
} from "@/features/forms/form-i/form-i-schema"
import { formIFields } from "@/features/forms/form-i/form-i-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormIPartnership() {
  function onSubmit(data: FormIValues) {
    console.log("Form I Partnership / MOA submitted:", data)
  }

  return (
    <DynamicForm<FormIValues>
      formSchema={formISchema}
      formFields={formIFields}
      defaultValues={{
        contributingUnit: "",
        titleOfPartnership: "",
        scopeOfWork: "",
        nameOfPartnerStakeholder: "",
        stakeholderCategory: "",
        trainingCourses: "",
        technicalAdvisoryService: "",
        informationDissemination: "",
        consultancy: "",
        communityOutreach: "",
        technologyKnowledgeTransfer: "",
        organizingEvents: "",
        typeOfPartnershipAgreement: "",
        otherAgreementType: "",
        partnershipStartDate: undefined,
        partnershipEndDate: undefined,
        moaDocument: [],
        remarks: "",
      }}
      onSubmit={onSubmit}
      title="Form I: Partnership / MOA"
      description="Use this form to record partnerships with stakeholders formalized through a MOA, MOU, or similar partnership agreement recognized by UP."
      submitLabel="Submit"
    />
  )
}
