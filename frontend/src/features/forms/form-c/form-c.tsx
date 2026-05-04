import {
  formCSchema,
  type FormValues
} from "@/features/forms/form-c/form-c-schema"
import { formFields } from "@/features/forms/form-c/form-c-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
export default function FormCOralOrPoster() {
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data)
  }

  return (
    <div className="p-8">
      {/* <h2 className="text-xl font-bold mb-4">SECTION C — ORAL PAPER OR POSTER PRESENTATIONS</h2> */}
      <DynamicForm<FormValues>
        formSchema={formCSchema}
        formFields={formFields}
        defaultValues={{
          researchTitle2: "",
          titlePresented: "",
          presentationType: "oral",
          eventType: "conference",
          eventTitle: "",
          organizerName: "",
          conferenceLocation: "institutionalInhouse",
          conferenceAddress: "",
          conferenceStartDate: new Date(),
          conferenceEndDate: undefined,
          presentationDate: new Date()
        }}
        onSubmit={onSubmit}
      />
    </div>
  )
}
