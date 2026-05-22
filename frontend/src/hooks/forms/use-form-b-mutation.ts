import {
  createFormBRecord,
  getFormBRecord,
  getFormBResearches,
  updateFormBRecord,
  type CreateFormBInput,
  type UpdateFormBInput
} from "@/api/forms/form-b.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormBRecord() {
  return useCreateFormMutation<CreateFormBInput, Awaited<ReturnType<typeof createFormBRecord>>>(
    ["forms", "form-b", "create"],
    createFormBRecord
  )
}

export function useFormBRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-b", "details", entryId],
    queryFn: () => getFormBRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}

export function useUpdateFormBRecord() {
  return useCreateFormMutation<UpdateFormBInput, Awaited<ReturnType<typeof updateFormBRecord>>>(
    ["forms", "form-b", "update"],
    updateFormBRecord
  )
}

export function useFormBResearches() {
  return useQuery({
    queryKey: ["forms", "form-b", "researches"],
    queryFn: getFormBResearches,
  })
}
