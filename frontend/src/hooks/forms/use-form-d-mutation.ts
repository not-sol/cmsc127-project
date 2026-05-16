import { createFormDRecord, getFormDRecord, type CreateFormDInput } from "@/api/forms/form-d.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormDRecord() {
  return useCreateFormMutation<CreateFormDInput, Awaited<ReturnType<typeof createFormDRecord>>>(
    ["forms", "form-d", "create"],
    createFormDRecord
  )
}

export function useFormDRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-d", "details", entryId],
    queryFn: () => getFormDRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
