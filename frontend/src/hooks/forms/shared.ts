import { useMutation } from "@tanstack/react-query"

export function useCreateFormMutation<TInput, TOutput>(
  mutationKey: string[],
  mutationFn: (input: TInput) => Promise<TOutput>
) {
  return useMutation({
    mutationKey,
    mutationFn,
  })
}
