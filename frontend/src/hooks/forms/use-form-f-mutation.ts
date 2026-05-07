import { createFormFRecord, type CreateFormFInput } from "@/api/forms/form-f.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormFRecord() {
  return useCreateFormMutation<CreateFormFInput, Awaited<ReturnType<typeof createFormFRecord>>>(
    ["forms", "form-f", "create"],
    createFormFRecord
  )
}
