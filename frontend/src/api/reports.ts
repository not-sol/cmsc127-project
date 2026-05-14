import { supabase } from "@/lib/supabase/client";

export type ReportStatus = "draft" | "pending" | "reviewed" | "archived";
export type ReviewStatus = "approved" | "partially_approved";

export interface AccomplishmentReport {
  report_id: number;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  date_submitted: string | null;
  status: ReportStatus | null;
  remarks: string | null;
  faculty_id: string | null;
  department_id: number | null;
}

export async function getAccessibleReports() {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .select("*")
    .order("date_submitted", { ascending: false });

  if (error) throw error;
  return data as AccomplishmentReport[];
}

export async function getDepartmentReviewQueue() {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .select("*")
    .in("status", ["pending", "reviewed"])
    .order("date_submitted", { ascending: false });

  if (error) throw error;
  return data as AccomplishmentReport[];
}

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
