import { createFormDRecord, type CreateFormDInput } from "@/api/forms/form-d.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormDRecord() {
  return useCreateFormMutation<CreateFormDInput, Awaited<ReturnType<typeof createFormDRecord>>>(
    ["forms", "form-d", "create"],
    createFormDRecord
  )
}
