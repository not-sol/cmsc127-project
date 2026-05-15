import {
  createFormBRecord,
  updateFormBRecord,
  type CreateFormBInput,
  type UpdateFormBInput,
} from "@/api/forms/form-b.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"

export function useCreateFormBRecord() {
  return useCreateFormMutation<CreateFormBInput, Awaited<ReturnType<typeof createFormBRecord>>>(
    ["forms", "form-b", "create"],
    createFormBRecord
  )
}

export function useUpdateFormBRecord() {
  return useCreateFormMutation<UpdateFormBInput, Awaited<ReturnType<typeof updateFormBRecord>>>(
    ["forms", "form-b", "update"],
    updateFormBRecord
  )
}
