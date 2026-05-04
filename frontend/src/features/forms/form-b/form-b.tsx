import {
  formBSchema,
  type FormValues
} from "@/features/forms/form-b/form-b-schema"
import { formFields } from "@/features/forms/form-b/form-b-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
export default function FormBGrantsAndFellowships() {
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data)
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION B — GRANTS AND FELLOWSHIPS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formBSchema}
        formFields={formFields}
        defaultValues={{
          contrUnit: "csmod",
          researchTitle: "",
          researchType: "basic",
          rStartDate: new Date(),
          rEndDate: undefined,
          researchTimeframeMonths: "",
          researcherNames: "",
          upSystemResearchGrantPesos: "0.00",
          externalFundingAmountPesos: "0.00",
          totalFundingPesos: "0.00",
          otherFundSource: "",
          majoritySource: "genFundCurYr",
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}
