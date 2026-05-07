import { createFormARecord, type CreateFormAInput } from "@/api/forms/form-a.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormARecord() {
  return useCreateFormMutation<CreateFormAInput, Awaited<ReturnType<typeof createFormARecord>>>(
    ["forms", "form-a", "create"],
    createFormARecord
  )
}
