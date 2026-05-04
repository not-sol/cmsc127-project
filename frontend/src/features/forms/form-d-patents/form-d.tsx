import {
  formDSchema,
  type FormValues
} from "@/features/forms/form-d-patents/form-d-schema"
import { formFields } from "@/features/forms/form-d-patents/form-d-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
export default function FormDPatents() {
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data)
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION C — ORAL PAPER OR POSTER PRESENTATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formDSchema}
        formFields={formFields}
        defaultValues={{
          researchTitle3: "",
          patentTitle: "",
          patentType: "invention",
          aplNum: "",
          aplInventors: "",
          aplApplicants: "",
          unexaminedApplicationDate: new Date(),
          grantPatentDate: undefined,
          regisNum: "",
          commercialProduct: "",
          utilType: "nAUtil",
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}