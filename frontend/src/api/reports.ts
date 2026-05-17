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

export interface ReportSummary extends AccomplishmentReport {
  entry_count: number;
}

export async function getAccessibleReports(): Promise<ReportSummary[]> {
  const [{ data, error }, { data: forms, error: formsError }] = await Promise.all([
    supabase
      .from("accomplishment_reports")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("forms").select("entry_id, report_id"),
  ]);

  if (error) throw error;
  if (formsError) throw formsError;

  const entryCounts = new Map<number, number>();

  for (const form of forms ?? []) {
    if (!form.report_id) continue;
    entryCounts.set(form.report_id, (entryCounts.get(form.report_id) ?? 0) + 1);
  }

  return ((data ?? []) as AccomplishmentReport[]).map((report) => ({
    ...report,
    entry_count: entryCounts.get(report.report_id) ?? 0,
  }));
}

export async function updateReportStatus(reportId: number, status: ReportStatus) {
  const payload: Partial<AccomplishmentReport> = { status };

  if (status === "pending") {
    payload.date_submitted = new Date().toISOString().slice(0, 10);
  }

  const { data, error } = await supabase
    .from("accomplishment_reports")
    .update(payload)
    .eq("report_id", reportId)
    .select("*")
    .single();

  if (error) throw error;
  return data as AccomplishmentReport;
}
