import { createFormBRecord, type CreateFormBInput } from "@/api/forms/form-b.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormBRecord() {
  return useCreateFormMutation<CreateFormBInput, Awaited<ReturnType<typeof createFormBRecord>>>(
    ["forms", "form-b", "create"],
    createFormBRecord
  )
}
