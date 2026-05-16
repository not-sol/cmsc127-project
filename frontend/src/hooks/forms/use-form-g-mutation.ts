import { createFormGRecord, getFormGRecord, type CreateFormGInput } from "@/api/forms/form-g.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormGRecord() {
  return useCreateFormMutation<CreateFormGInput, Awaited<ReturnType<typeof createFormGRecord>>>(
    ["forms", "form-g", "create"],
    createFormGRecord
  )
}

export function useFormGRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-g", "details", entryId],
    queryFn: () => getFormGRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
