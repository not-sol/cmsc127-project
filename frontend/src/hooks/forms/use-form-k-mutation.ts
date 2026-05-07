import { createFormKRecord, type CreateFormKInput } from "@/api/forms/form-k.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormKRecord() {
  return useCreateFormMutation<CreateFormKInput, Awaited<ReturnType<typeof createFormKRecord>>>(
    ["forms", "form-k", "create"],
    createFormKRecord
  )
}
