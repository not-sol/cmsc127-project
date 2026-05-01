import { formSchema, type FormValues } from "@/features/forms/form-test/test-schema"
import { formFields } from "@/features/forms/form-test/test-config"
import { DynamicForm as FormRenderer } from "@/components/dynamic-form"

export default function TestForm() {
  async function onSubmit(data: FormValues) {
    console.log("Submitted Data:", data)

    // Upload belongs here. For example, send data.attachments to Supabase or an API.
    // await Promise.all(data.attachments.map((file) => uploadAttachment(file)))
  }

  return (
    <>
      <FormRenderer<FormValues>
        formSchema={formSchema}
        formFields={formFields}
        defaultValues={{
          title: "",
          description: "",
          platforms: [],
          attachments: [],
        }}
        onSubmit={onSubmit}
        title="Form for Cool People"
        description="This form is yeaaa. Cool!"
      />
    </>
  )
}
