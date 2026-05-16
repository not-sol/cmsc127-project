import { createFormIRecord, getFormIRecord, type CreateFormIInput } from "@/api/forms/form-i.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormIRecord() {
  return useCreateFormMutation<CreateFormIInput, Awaited<ReturnType<typeof createFormIRecord>>>(
    ["forms", "form-i", "create"],
    createFormIRecord
  )
}

export function useFormIRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-i", "details", entryId],
    queryFn: () => getFormIRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
