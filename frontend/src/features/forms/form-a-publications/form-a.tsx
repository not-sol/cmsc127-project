import {
  formASchema,
  type FormValues
} from "@/features/forms/form-a-publications/form-a-schema"
import { formFields } from "@/features/forms/form-a-publications/form-a-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
export default function FormAPublications() {
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data)
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION A — PUBLICATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formASchema}
        formFields={formFields}
        defaultValues={{
          pubType: "book",
          pubTitle: "",
          pubAuthors: "",
          pubDate: "",
          pubName: "",
          pubrType: "Commercial",
          pubrLocr: "Local",
          isIsi: "No",
          scopus: "No",
          pubmedMedline: "No",
          isChedRecognized: "No",
          peerRev: "No",
          citationNum: "0",
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}
