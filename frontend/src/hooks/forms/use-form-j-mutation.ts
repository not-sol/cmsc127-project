import { createFormJRecord, getFormJRecord, type CreateFormJInput } from "@/api/forms/form-j.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormJRecord() {
  return useCreateFormMutation<CreateFormJInput, Awaited<ReturnType<typeof createFormJRecord>>>(
    ["forms", "form-j", "create"],
    createFormJRecord
  )
}

export function useFormJRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-j", "details", entryId],
    queryFn: () => getFormJRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
