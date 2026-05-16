import { createFormHRecord, getFormHRecord, type CreateFormHInput } from "@/api/forms/form-h.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormHRecord() {
  return useCreateFormMutation<CreateFormHInput, Awaited<ReturnType<typeof createFormHRecord>>>(
    ["forms", "form-h", "create"],
    createFormHRecord
  )
}

export function useFormHRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-h", "details", entryId],
    queryFn: () => getFormHRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
