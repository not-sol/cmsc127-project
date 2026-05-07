import { createFormJRecord, type CreateFormJInput } from "@/api/forms/form-j.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormJRecord() {
  return useCreateFormMutation<CreateFormJInput, Awaited<ReturnType<typeof createFormJRecord>>>(
    ["forms", "form-j", "create"],
    createFormJRecord
  )
}
