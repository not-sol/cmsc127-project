import { createFormKRecord, getFormKRecord, type CreateFormKInput } from "@/api/forms/form-k.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormKRecord() {
  return useCreateFormMutation<CreateFormKInput, Awaited<ReturnType<typeof createFormKRecord>>>(
    ["forms", "form-k", "create"],
    createFormKRecord
  )
}

export function useFormKRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-k", "details", entryId],
    queryFn: () => getFormKRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
