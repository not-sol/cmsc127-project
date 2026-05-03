import { formHSchema, type FormHValues } from "@/features/forms/form-h/form-h-schema"
import { formHFields } from "@/features/forms/form-h/form-h-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormH() {
  function onSubmit(data: FormHValues) {
    console.log("Form H Extension Program submitted:", data)
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
    />
  )
}
