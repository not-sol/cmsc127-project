import { createFormCRecord, type CreateFormCInput } from "@/api/forms/form-c.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormCRecord() {
  return useCreateFormMutation<CreateFormCInput, Awaited<ReturnType<typeof createFormCRecord>>>(
    ["forms", "form-c", "create"],
    createFormCRecord
  )
}
