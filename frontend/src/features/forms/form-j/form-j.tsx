import {
  formJAuthorshipSchema,
  type FormJAuthorshipValues,
} from "@/features/forms/form-j/form-j-schema"
import { formJAuthorshipFields } from "@/features/forms/form-j/form-j-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"

export default function FormJAuthorship() {
  function onSubmit(data: FormJAuthorshipValues) {
    console.log("Form J Authorship submitted:", data)
  }

  return (
    <DynamicForm<FormJAuthorshipValues>
      formSchema={formJAuthorshipSchema}
      formFields={formJAuthorshipFields}
      defaultValues={{
        titleOfMaterial: "",
        authors: "",
        year: "",
        attachments: [],
        remarks: "",
        relatedKRAs: "",
      }}
      onSubmit={onSubmit}
      title="Form J: Authorships (Audio-Visual Materials / Learning Objects / Manuals)"
      description="Use this form to record authorship of instructional materials that do not qualify as publications, such as laboratory manuals, lecture manuals, and learning objects."
      submitLabel="Submit"
    />
  )
}
