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
  latest_review_id: number | null;
  latest_review_status: ReviewStatus | null;
  latest_review_remarks: string | null;
  latest_review_date: string | null;
  latest_review_created_at: string | null;
  latest_reviewed_by: string | null;
  latest_reviewer_first_name: string | null;
  latest_reviewer_last_name: string | null;
  latest_reviewer_email: string | null;
}

type ReviewRow = {
  reviews_id: number;
  created_at: string;
  review_date: string | null;
  status: ReviewStatus | null;
  remarks: string | null;
  report_id: number | null;
  reviewed_by: string | null;
};

type UserRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export type ReportMetadataInput = {
  startDate?: string | null;
  endDate?: string | null;
  remarks?: string | null;
  departmentId?: number | null;
};

export async function getOrCreateDraftReportId(
  reportId?: number | null,
  input: ReportMetadataInput = {}
): Promise<number> {
  if (reportId && Number.isFinite(reportId) && reportId > 0) return reportId;

  const report = await createDraftReport(input);
  return report.report_id;
}

export async function getAccessibleReports(): Promise<ReportSummary[]> {
  const [
    { data, error },
    { data: forms, error: formsError },
    { data: reviews, error: reviewsError },
  ] = await Promise.all([
    supabase
      .from("accomplishment_reports")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("forms").select("entry_id, report_id"),
    supabase
      .from("reviews")
      .select("reviews_id, created_at, review_date, status, remarks, report_id, reviewed_by"),
  ]);

  if (error) throw error;
  if (formsError) throw formsError;
  if (reviewsError) throw reviewsError;

  const entryCounts = new Map<number, number>();
  const latestReviewByReportId = new Map<number, ReviewRow>();

  for (const form of forms ?? []) {
    if (!form.report_id) continue;
    entryCounts.set(form.report_id, (entryCounts.get(form.report_id) ?? 0) + 1);
  }

  for (const review of (reviews ?? []) as ReviewRow[]) {
    if (!review.report_id) continue;

    const current = latestReviewByReportId.get(review.report_id);
    const reviewTime = new Date(review.created_at).getTime();
    const currentTime = current ? new Date(current.created_at).getTime() : 0;

    if (!current || reviewTime > currentTime || (reviewTime === currentTime && review.reviews_id > current.reviews_id)) {
      latestReviewByReportId.set(review.report_id, review);
    }
  }

  const reviewerIds = Array.from(
    new Set(
      Array.from(latestReviewByReportId.values())
        .map((review) => review.reviewed_by)
        .filter((id): id is string => Boolean(id))
    )
  );

  const { data: reviewers, error: reviewersError } =
    reviewerIds.length > 0
      ? await supabase
          .from("users")
          .select("id, first_name, last_name, email")
          .in("id", reviewerIds)
      : { data: [], error: null };

  if (reviewersError) throw reviewersError;

  const reviewerById = new Map(
    ((reviewers ?? []) as UserRow[]).map((reviewer) => [reviewer.id, reviewer])
  );

  return ((data ?? []) as AccomplishmentReport[]).map((report) => ({
    ...report,
    entry_count: entryCounts.get(report.report_id) ?? 0,
    latest_review_id: latestReviewByReportId.get(report.report_id)?.reviews_id ?? null,
    latest_review_status: latestReviewByReportId.get(report.report_id)?.status ?? null,
    latest_review_remarks: latestReviewByReportId.get(report.report_id)?.remarks ?? null,
    latest_review_date: latestReviewByReportId.get(report.report_id)?.review_date ?? null,
    latest_review_created_at: latestReviewByReportId.get(report.report_id)?.created_at ?? null,
    latest_reviewed_by: latestReviewByReportId.get(report.report_id)?.reviewed_by ?? null,
    latest_reviewer_first_name: latestReviewByReportId.get(report.report_id)?.reviewed_by
      ? reviewerById.get(latestReviewByReportId.get(report.report_id)!.reviewed_by!)?.first_name ?? null
      : null,
    latest_reviewer_last_name: latestReviewByReportId.get(report.report_id)?.reviewed_by
      ? reviewerById.get(latestReviewByReportId.get(report.report_id)!.reviewed_by!)?.last_name ?? null
      : null,
    latest_reviewer_email: latestReviewByReportId.get(report.report_id)?.reviewed_by
      ? reviewerById.get(latestReviewByReportId.get(report.report_id)!.reviewed_by!)?.email ?? null
      : null,
  }));
}

function toReportPayload(input: ReportMetadataInput) {
  return {
    ...(input.startDate !== undefined ? { start_date: input.startDate } : {}),
    ...(input.endDate !== undefined ? { end_date: input.endDate } : {}),
    ...(input.remarks !== undefined ? { remarks: input.remarks } : {}),
    ...(input.departmentId !== undefined ? { department_id: input.departmentId } : {}),
  };
}

export async function createDraftReport(input: ReportMetadataInput = {}) {
  const { data, error } = await supabase.rpc("create_draft_accomplishment_report", {
    p_start_date: input.startDate ?? null,
    p_end_date: input.endDate ?? null,
    p_remarks: input.remarks ?? null,
    p_department_id: input.departmentId ?? null,
  });

  if (error) throw error;
  return data as AccomplishmentReport;
}

export async function updateReportMetadata(reportId: number, input: ReportMetadataInput) {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .update(toReportPayload(input))
    .eq("report_id", reportId)
    .eq("status", "draft")
    .select("*")
    .single();

  if (error) throw error;
  return data as AccomplishmentReport;
}

export async function updateReportStatus(
  reportId: number,
  status: ReportStatus,
  input: ReportMetadataInput = {}
) {
  const payload: Partial<AccomplishmentReport> = {
    status,
    ...toReportPayload(input),
  };

  if (status === "pending") {
    payload.date_submitted = new Date().toISOString().slice(0, 10);
  } else if (status === "draft") {
    payload.date_submitted = null;
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
