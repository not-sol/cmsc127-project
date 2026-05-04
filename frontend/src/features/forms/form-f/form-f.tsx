import { formFSchema, type FormFValues } from "@/features/forms/form-f/form-f-schema"
import { formFFields } from "@/features/forms/form-f/form-f-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormF() {
  function onSubmit(data: FormFValues) {
    console.log("Form F Awards / Grants submitted:", data)
  }

  return (
    <DynamicForm<FormFValues>
      formSchema={formFSchema}
      formFields={formFFields}
      defaultValues={{
        type: "",
        awardGrantTitle: "",
        sourceAwardingBody: "",
        details: "",
        startDate: undefined,
        endDate: undefined,
        attachments: [],
        remarks: "",
        relatedKras: "",
      }}
      onSubmit={onSubmit}
      title="Form F: Awards / Grants"
      description="Use this form to record awards and grants received. Awards and grants are recorded for completeness and support performance narratives."
      submitLabel="Submit"
    />
  )
}
