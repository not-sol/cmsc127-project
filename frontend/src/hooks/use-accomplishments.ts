import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccomplishments,
  createAccomplishment,
} from "@/api/accomplishments";

const ACCOMPLISHMENTS_QUERY_KEY = ["accomplishments"];

export function useAccomplishments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ACCOMPLISHMENTS_QUERY_KEY,
    queryFn: fetchAccomplishments,
  });

  const mutation = useMutation({
    mutationFn: createAccomplishment,
    onSuccess: (newData) => {
      // Optimistic update (optional) or just invalidate
      // queryClient.invalidateQueries({ queryKey: ACCOMPLISHMENTS_QUERY_KEY });
      
      // Better: Update cache directly for immediate UI update
      queryClient.setQueryData(ACCOMPLISHMENTS_QUERY_KEY, (old: any) => [
        newData,
        ...(old || []),
      ]);
    },
  });

  return {
    accomplishments: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createAccomplishment: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submissionError: mutation.error,
  };
}
