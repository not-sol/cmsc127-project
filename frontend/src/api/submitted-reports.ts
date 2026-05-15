import { supabase } from "@/lib/supabase/client";
import type { ReportStatus, ReviewStatus } from "@/api/reports";
import type { AppRole } from "@/api/profile";

export interface SubmittedReport {
  report_id: number;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  date_submitted: string | null;
  status: Extract<ReportStatus, "pending" | "reviewed">;
  remarks: string | null;
  faculty_id: string | null;
  department_id: number | null;
  faculty_first_name: string | null;
  faculty_last_name: string | null;
  faculty_email: string | null;
  department_name: string | null;
  college_name: string | null;
  entry_count: number;
  latest_review_id: number | null;
  latest_review_status: ReviewStatus | null;
  latest_review_remarks: string | null;
  latest_review_date: string | null;
  latest_reviewed_by: string | null;
}

export interface SubmittedReportUpdate {
  reportId: number;
  startDate: string | null;
  endDate: string | null;
  remarks: string | null;
}

export interface ReviewDecisionInput {
  reportId: number;
  status: ReviewStatus;
  remarks?: string;
}

export interface ReviewUpdateInput {
  reviewId: number;
  status: ReviewStatus;
  remarks?: string;
}

export interface GetSubmittedReportsOptions {
  role: AppRole | null;
  departmentId: number | null;
}

type ReportRow = {
  report_id: number;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  date_submitted: string | null;
  status: ReportStatus | null;
  remarks: string | null;
  faculty_id: string | null;
  department_id: number | null;
};

type UserRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  department_id: number | null;
};

type DepartmentRow = {
  department_id: number;
  department_name: string | null;
  college_name: string | null;
};

type ReviewRow = {
  reviews_id: number;
  created_at: string;
  review_date: string | null;
  status: ReviewStatus | null;
  remarks: string | null;
  report_id: number | null;
  reviewed_by: string | null;
};

type FormRow = {
  entry_id: number;
  report_id: number | null;
};

function uniqueValues<TValue>(values: (TValue | null | undefined)[]) {
  return Array.from(
    new Set(values.filter((value): value is TValue => value != null))
  );
}

async function getOptionalForms(reportIds: number[]) {
  const { data, error } = await supabase
    .from("forms")
    .select("entry_id, report_id")
    .in("report_id", reportIds);

  if (error) return [];
  return (data ?? []) as FormRow[];
}

async function getOptionalUsers(facultyIds: string[]) {
  if (facultyIds.length === 0) return [];

  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, department_id")
    .in("id", facultyIds);

  if (error) return [];
  return (data ?? []) as UserRow[];
}

function toSubmittedReport({
  row,
  user,
  department,
  reviews,
  entryCount,
}: {
  row: ReportRow;
  user: UserRow | null;
  department: DepartmentRow | null;
  reviews: ReviewRow[];
  entryCount: number;
}): SubmittedReport {
  const latestReview =
    reviews
      .filter((review) => review.status)
      .sort((a, b) => {
        const createdAtDiff =
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

        return createdAtDiff || b.reviews_id - a.reviews_id;
      })[0] ?? null;

  return {
    report_id: row.report_id,
    created_at: row.created_at,
    start_date: row.start_date,
    end_date: row.end_date,
    date_submitted: row.date_submitted,
    status: row.status === "reviewed" ? "reviewed" : "pending",
    remarks: row.remarks,
    faculty_id: row.faculty_id,
    department_id: row.department_id ?? user?.department_id ?? null,
    faculty_first_name: user?.first_name ?? null,
    faculty_last_name: user?.last_name ?? null,
    faculty_email: user?.email ?? null,
    department_name: department?.department_name ?? null,
    college_name: department?.college_name ?? null,
    entry_count: entryCount,
    latest_review_id: latestReview?.reviews_id ?? null,
    latest_review_status: latestReview?.status ?? null,
    latest_review_remarks: latestReview?.remarks ?? null,
    latest_review_date: latestReview?.review_date ?? null,
    latest_reviewed_by: latestReview?.reviewed_by ?? null,
  };
}

export async function getSubmittedReports({
  role,
  departmentId,
}: GetSubmittedReportsOptions) {
  if (role !== "department_chair" && role !== "admin") {
    return [];
  }

  const { data: reports, error } = await supabase
    .from("accomplishment_reports")
    .select(
      "report_id, created_at, start_date, end_date, date_submitted, status, remarks, faculty_id, department_id"
    )
    .in("status", ["pending", "reviewed"])
    .order("date_submitted", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  const reportRows = (reports ?? []) as ReportRow[];
  const reportIds = reportRows.map((report) => report.report_id);

  if (reportIds.length === 0) return [];

  const facultyIds = uniqueValues(reportRows.map((report) => report.faculty_id));

  const [{ data: reviews, error: reviewsError }, forms, users] =
    await Promise.all([
      supabase
        .from("reviews")
        .select(
          "reviews_id, created_at, review_date, status, remarks, report_id, reviewed_by"
        )
        .in("report_id", reportIds),
      getOptionalForms(reportIds),
      getOptionalUsers(facultyIds),
    ]);

  if (reviewsError) throw reviewsError;

  const userById = new Map(users.map((user) => [user.id, user]));
  const departmentIds = uniqueValues([
    ...reportRows.map((report) => report.department_id),
    ...users.map((user) => user.department_id),
  ]);

  const { data: departments, error: departmentsError } =
    departmentIds.length > 0
      ? await supabase
          .from("departments")
          .select("department_id, department_name, college_name")
          .in("department_id", departmentIds)
      : { data: [], error: null };

  if (departmentsError) throw departmentsError;

  const departmentById = new Map(
    ((departments ?? []) as DepartmentRow[]).map((department) => [
      department.department_id,
      department,
    ])
  );
  const reviewsByReportId = new Map<number, ReviewRow[]>();
  const entryCountsByReportId = new Map<number, number>();

  for (const review of (reviews ?? []) as ReviewRow[]) {
    if (!review.report_id) continue;
    reviewsByReportId.set(review.report_id, [
      ...(reviewsByReportId.get(review.report_id) ?? []),
      review,
    ]);
  }

  for (const form of forms) {
    if (!form.report_id) continue;
    entryCountsByReportId.set(
      form.report_id,
      (entryCountsByReportId.get(form.report_id) ?? 0) + 1
    );
  }

  const submittedReports = reportRows.map((row) => {
    const user = row.faculty_id ? userById.get(row.faculty_id) ?? null : null;
    const departmentId = row.department_id ?? user?.department_id ?? null;

    return toSubmittedReport({
      row,
      user,
      department: departmentId ? departmentById.get(departmentId) ?? null : null,
      reviews: reviewsByReportId.get(row.report_id) ?? [],
      entryCount: entryCountsByReportId.get(row.report_id) ?? 0,
    });
  });

  if (role === "department_chair") {
    return submittedReports.filter(
      (report) =>
        departmentId !== null && report.department_id === departmentId
    );
  }

  return submittedReports;
}

export async function updateSubmittedReport({
  reportId,
  startDate,
  endDate,
  remarks,
}: SubmittedReportUpdate) {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .update({
      start_date: startDate,
      end_date: endDate,
      remarks,
    })
    .eq("report_id", reportId)
    .in("status", ["pending", "reviewed"])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createReviewDecision({
  reportId,
  status,
  remarks,
}: ReviewDecisionInput) {
  const { data, error } = await supabase.rpc("review_accomplishment_report", {
    p_report_id: reportId,
    p_status: status,
    p_remarks: remarks ?? null,
  });

  if (error) throw error;
  return data;
}

export async function updateReviewDecision({
  reviewId,
  status,
  remarks,
}: ReviewUpdateInput) {
  const { data, error } = await supabase
    .from("reviews")
    .update({
      status,
      remarks: remarks ?? null,
      review_date: new Date().toISOString().slice(0, 10),
    })
    .eq("reviews_id", reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
