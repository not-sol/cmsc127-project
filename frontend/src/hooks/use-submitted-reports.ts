import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReviewDecision,
  getSubmittedReports,
  updateReviewDecision,
  updateSubmittedReport,
  type ReviewDecisionInput,
  type ReviewUpdateInput,
  type SubmittedReportUpdate,
} from "@/api/submitted-reports";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const submittedReportsQueryKey = ["submitted-reports"] as const;

export function useSubmittedReports() {
  const queryClient = useQueryClient();
  const { role, profile } = useAuth();

  useEffect(() => {
    const channel = supabase
      .channel("submitted-reports-management")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "accomplishment_reports" },
        () => {
          void queryClient.invalidateQueries({
            queryKey: submittedReportsQueryKey,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        () => {
          void queryClient.invalidateQueries({
            queryKey: submittedReportsQueryKey,
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: [
      ...submittedReportsQueryKey,
      role,
      profile?.department_id ?? null,
    ],
    queryFn: () =>
      getSubmittedReports({
        role,
        departmentId: profile?.department_id ?? null,
      }),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    enabled: role === "department_chair" || role === "admin",
  });
}

export function useUpdateSubmittedReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmittedReportUpdate) => updateSubmittedReport(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: submittedReportsQueryKey });
    },
  });
}

export function useCreateReviewDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewDecisionInput) => createReviewDecision(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: submittedReportsQueryKey });
    },
  });
}

export function useUpdateReviewDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewUpdateInput) => updateReviewDecision(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: submittedReportsQueryKey });
    },
  });
}
