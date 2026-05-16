import { createFormARecord, getFormARecord, type CreateFormAInput } from "@/api/forms/form-a.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormARecord() {
  return useCreateFormMutation<CreateFormAInput, Awaited<ReturnType<typeof createFormARecord>>>(
    ["forms", "form-a", "create"],
    createFormARecord
  )
}

export function useFormARecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-a", "details", entryId],
    queryFn: () => getFormARecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
