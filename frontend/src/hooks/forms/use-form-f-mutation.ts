import { createFormFRecord, getFormFRecord, type CreateFormFInput } from "@/api/forms/form-f.api"
import { useCreateFormMutation } from "@/hooks/forms/shared"
import { useQuery } from "@tanstack/react-query"

export function useCreateFormFRecord() {
  return useCreateFormMutation<CreateFormFInput, Awaited<ReturnType<typeof createFormFRecord>>>(
    ["forms", "form-f", "create"],
    createFormFRecord
  )
}

export function useFormFRecord(entryId: number) {
  return useQuery({
    queryKey: ["forms", "form-f", "details", entryId],
    queryFn: () => getFormFRecord(entryId),
    enabled: !!entryId && entryId > 0,
  })
}
