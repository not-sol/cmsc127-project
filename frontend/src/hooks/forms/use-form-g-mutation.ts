import { createFormGRecord, type CreateFormGInput } from "@/api/forms/form-g.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormGRecord() {
  return useCreateFormMutation<CreateFormGInput, Awaited<ReturnType<typeof createFormGRecord>>>(
    ["forms", "form-g", "create"],
    createFormGRecord
  )
}
