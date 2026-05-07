import { createFormIRecord, type CreateFormIInput } from "@/api/forms/form-i.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormIRecord() {
  return useCreateFormMutation<CreateFormIInput, Awaited<ReturnType<typeof createFormIRecord>>>(
    ["forms", "form-i", "create"],
    createFormIRecord
  )
}
