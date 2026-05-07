import {
  formCSchema,
  type FormValues
} from "@/features/forms/form-c/form-c-schema"
import { formFields } from "@/features/forms/form-c/form-c-config"
import { DynamicForm } from "@/features/forms/dynamic-form/dynamic-form"
import { getMutationErrorMessage } from "@/api/forms/shared"
import { useCreateFormCRecord } from "@/hooks/forms/use-form-c-mutation"
import { useAuthStore } from "@/store/auth-store"

export default function FormCOralOrPoster() {
  const createFormCRecord = useCreateFormCRecord()
  const userId = useAuthStore((state) => state.user?.id)

  const onSubmit = async (data: FormValues) => {
    await createFormCRecord.mutateAsync({
      values: data,
      submittedBy: userId,
    })
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
        submitError={getMutationErrorMessage(createFormCRecord.error)}
        submitSuccess={
          createFormCRecord.isSuccess ? "Presentation entry created successfully." : undefined
        }
      />
    </div>
  )
}
