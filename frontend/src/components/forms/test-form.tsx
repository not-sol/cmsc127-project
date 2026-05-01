import { formSchema, type FormValues } from "@/features/forms/form-test/test-schema"
import { formFields } from "@/features/forms/form-test/test-config"
import { DynamicForm as FormRenderer } from "@/components/forms/dynamic-form/dynamic-form"


export default function TestForm() {
  function onSubmit(data: FormValues) {
    console.log("Submitted Data:", data)
  }

  return (
    <FormRenderer<FormValues>
      formSchema={formSchema}
      formFields={formFields}
      defaultValues={{
        title: "",
        description: "",
        // extras: "default",
        // platforms: [],
      }}
      onSubmit={onSubmit}
      title="Form for Cool People"
      description="This form is yeaaa. Cool!"
    />
  )
}
