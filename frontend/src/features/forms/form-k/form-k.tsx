import {
  formKOtherSchema,
  type FormKOtherValues,
} from "@/features/forms/form-k/form-k-schema"
import { formKOtherFields } from "@/features/forms/form-k/form-k-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormKOther() {
  function onSubmit(data: FormKOtherValues) {
    console.log("Form K Other Accomplishment submitted:", data)
  }

  return (
    <DynamicForm<FormKOtherValues>
      formSchema={formKOtherSchema}
      formFields={formKOtherFields}
      defaultValues={{
        title: "",
        description: "",
        date: undefined,
        supportingDocuments: [],
      }}
      onSubmit={onSubmit}
      title="Form K: Other Accomplishment"
      description="Use this form to record significant accomplishments that do not fall under a predefined category. Provide a clear description and upload any relevant supporting documents."
      submitLabel="Submit"
    />
  )
}
