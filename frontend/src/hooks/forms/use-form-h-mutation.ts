import { createFormHRecord, type CreateFormHInput } from "@/api/forms/form-h.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormHRecord() {
  return useCreateFormMutation<CreateFormHInput, Awaited<ReturnType<typeof createFormHRecord>>>(
    ["forms", "form-h", "create"],
    createFormHRecord
  )
}
