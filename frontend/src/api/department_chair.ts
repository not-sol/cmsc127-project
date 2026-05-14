import { supabase } from "@/lib/supabase/client";
import type { AccomplishmentReport, ReviewStatus } from "./reports";

/**
 * Fetches the list of reports that are pending or have been reviewed 
 * and are awaiting further action from the department chair.
 */
export async function getDepartmentReviewQueue() {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .select("*")
    .in("status", ["pending", "reviewed"])
    .order("date_submitted", { ascending: false });

  if (error) throw error;
  return data as AccomplishmentReport[];
}

/**
 * Submits a review for an accomplishment report.
 * This calls a database RPC to handle the state transition and logging.
 */
export async function reviewAccomplishmentReport({
  reportId,
  status,
  remarks,
}: {
  reportId: number;
  status: ReviewStatus;
  remarks?: string;
}) {
  const { data, error } = await supabase.rpc("review_accomplishment_report", {
    p_report_id: reportId,
    p_status: status,
    p_remarks: remarks ?? null,
  });

  if (error) throw error;
  return data;
}
