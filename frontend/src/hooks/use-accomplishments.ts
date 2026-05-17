import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAccomplishments,
  createAccomplishment,
  updateAccomplishment,
  deleteAccomplishment,
  type CreateAccomplishmentInput,
  type UpdateAccomplishmentInput,
} from "@/api/accomplishments";

const ACCOMPLISHMENTS_QUERY_KEY = ["accomplishments"];

export function useAccomplishments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ACCOMPLISHMENTS_QUERY_KEY,
    queryFn: fetchAccomplishments,
  });

  const createMutation = useMutation({
    mutationFn: ({ input, status }: { input: CreateAccomplishmentInput; status?: "draft" | "submitted" }) => 
      createAccomplishment(input, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOMPLISHMENTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ entryId, input }: { entryId: number; input: UpdateAccomplishmentInput }) => 
      updateAccomplishment(entryId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOMPLISHMENTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccomplishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOMPLISHMENTS_QUERY_KEY });
    },
  });

  return {
    accomplishments: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createAccomplishment: createMutation.mutateAsync,
    isSubmitting: createMutation.isPending,
    submissionError: createMutation.error,
    updateAccomplishment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteAccomplishment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}
