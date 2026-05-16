import { createFormERecord, getFormERecord, type CreateFormEInput } from "@/api/forms/form-e.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormERecord() {
  return useCreateFormMutation<CreateFormEInput, Awaited<ReturnType<typeof createFormERecord>>>(
    ["forms", "form-e", "create"],
    createFormERecord
  )
}

export function useFormERecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-e", "details", entryId],
    queryFn: () => getFormERecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
