import { createFormCRecord, getFormCRecord, type CreateFormCInput } from "@/api/forms/form-c.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormCRecord() {
  return useCreateFormMutation<CreateFormCInput, Awaited<ReturnType<typeof createFormCRecord>>>(
    ["forms", "form-c", "create"],
    createFormCRecord
  )
}

export function useFormCRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-c", "details", entryId],
    queryFn: () => getFormCRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
