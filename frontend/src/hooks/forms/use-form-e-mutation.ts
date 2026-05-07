import { createFormERecord, type CreateFormEInput } from "@/api/forms/form-e.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormERecord() {
  return useCreateFormMutation<CreateFormEInput, Awaited<ReturnType<typeof createFormERecord>>>(
    ["forms", "form-e", "create"],
    createFormERecord
  )
}
