import { supabase } from "@/lib/supabase/client";
import type { ReportStatus, ReviewStatus } from "@/api/reports";
import type { AppRole } from "@/api/profile";

export interface SubmittedReport {
  report_id: number;
  created_at: string;
  title: string | null;
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
  title: string | null;
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
  reportId: number;
  status: ReviewStatus;
  remarks?: string;
}

export interface GetSubmittedReportsOptions {
  role: AppRole | null;
  departmentId: number | null;
}

export interface SubmittedReportDetailOptions extends GetSubmittedReportsOptions {
  reportId: number;
}

export interface SubmittedReportFormGroup {
  label: string;
  values: Record<string, SubmittedReportFieldValue>;
}

export interface SubmittedReportFormDetail {
  entry_id: number;
  title: string;
  type: string;
  groups: SubmittedReportFormGroup[];
}

export interface SubmittedReportDetail {
  report: SubmittedReport;
  forms: SubmittedReportFormDetail[];
}

type ReportRow = {
  report_id: number;
  created_at: string;
  title: string | null;
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
  created_at?: string;
  title?: string | null;
  description?: string | null;
  author?: string | null;
  form_type_id?: number | null;
};

type DetailTableConfig = {
  table: string;
  label: string;
  type: string;
};

type SupportingDocumentRow = {
  document_id: number;
  file_name: string | null;
  entry_id: number | null;
  bucket_id: string | null;
  storage_path: string | null;
  document_type: string | null;
};

export type SubmittedAttachmentLink = {
  kind: "attachment-links";
  links: {
    label: string;
    url: string;
  }[];
};

export type SubmittedReportFieldValue =
  | string
  | number
  | boolean
  | null
  | SubmittedAttachmentLink;

const DETAIL_TABLES: DetailTableConfig[] = [
  {
    table: "isip_publication_forms",
    label: "ISIP Publication",
    type: "Publication",
  },
  {
    table: "pbms_publication_forms",
    label: "PBMS Publication",
    type: "Publication",
  },
  {
    table: "isip_research_forms",
    label: "ISIP Research Grant",
    type: "Research Grant",
  },
  { table: "pbms_research_forms", label: "PBMS Research Grant", type: "Research Grant" },
  {
    table: "isip_oral_forms",
    label: "ISIP Paper Presentation",
    type: "Paper Presentation",
  },
  { table: "pbms_oral_forms", label: "PBMS Paper Presentation", type: "Paper Presentation" },
  {
    table: "isip_patents_forms",
    label: "ISIP Patent",
    type: "Patent",
  },
  { table: "pbms_patents_forms", label: "PBMS Patent", type: "Patent" },
  {
    table: "isip_creative_work_forms",
    label: "ISIP Creative Work",
    type: "Creative Work",
  },
  {
    table: "pbms_creative_work_forms",
    label: "PBMS Creative Work",
    type: "Creative Work",
  },
  {
    table: "isip_awards_forms",
    label: "ISIP Award / Grant",
    type: "Award / Grant",
  },
  {
    table: "isip_trainings_forms",
    label: "ISIP Training",
    type: "Training",
  },
  { table: "pbms_trainings_forms", label: "PBMS Training", type: "Training" },
  {
    table: "isip_extension_programs_forms",
    label: "ISIP Extension Program",
    type: "Extension Program",
  },
  { table: "pbms_extension_programs_forms", label: "PBMS Extension Program", type: "Extension Program" },
  { table: "isip_partnership_forms", label: "ISIP Partnership / MOA", type: "Partnership / MOA" },
  {
    table: "pbms_partnerships_forms",
    label: "PBMS Partnership / MOA",
    type: "Partnership / MOA",
  },
  {
    table: "isip_authorship_forms",
    label: "ISIP Authorship",
    type: "Authorship",
  },
  {
    table: "isip_other_accomplishments_forms",
    label: "ISIP Other Accomplishment",
    type: "Other Accomplishment",
  },
  { table: "pbms_other_accomplishments_forms", label: "PBMS Other Accomplishment", type: "Other Accomplishment" },
];

const INTERNAL_FIELD_KEYS = new Set([
  "created_at",
  "updated_at",
  "submitted_by",
  "isip_submitted_by",
  "reviewed_by",
]);

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

function humanizeKey(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isInternalFieldKey(key: string) {
  return key === "id" || key.endsWith("_id") || INTERNAL_FIELD_KEYS.has(key);
}

function getAttachmentLabel(path: string, index: number) {
  const cleanPath = path.split("?")[0] ?? path;
  const name = cleanPath.split("/").filter(Boolean).at(-1);

  return name || `Attachment ${index + 1}`;
}

async function getSupportingDocumentLinks(entryIds: number[]) {
  if (entryIds.length === 0) return new Map<number, SubmittedAttachmentLink>();

  const { data, error } = await supabase
    .from("supporting_documents")
    .select("document_id, file_name, entry_id, bucket_id, storage_path, document_type")
    .in("entry_id", entryIds)
    .order("document_id", { ascending: true });

  if (error) {
    console.warn("Failed to fetch supporting documents:", error);
    return new Map<number, SubmittedAttachmentLink>();
  }

  const documentsByEntryId = new Map<number, SupportingDocumentRow[]>();

  for (const document of (data ?? []) as SupportingDocumentRow[]) {
    if (!document.entry_id) continue;
    documentsByEntryId.set(document.entry_id, [
      ...(documentsByEntryId.get(document.entry_id) ?? []),
      document,
    ]);
  }

  const linksByEntryId = new Map<number, SubmittedAttachmentLink>();

  await Promise.all(
    Array.from(documentsByEntryId.entries()).map(async ([entryId, documents]) => {
      const links = await Promise.all(
        documents.map(async (document, index) => {
          const path = document.storage_path ?? document.file_name ?? "";
          const bucket = document.bucket_id;

          if (!path || !bucket) return null;

          if (/^https?:\/\//i.test(path)) {
            return {
              label: document.file_name ?? getAttachmentLabel(path, index),
              url: path,
            };
          }

          const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);

          if (error) {
            console.warn(`Failed to create signed URL for ${bucket}/${path}:`, error);
          }

          return {
            label: document.file_name ?? getAttachmentLabel(path, index),
            url: data?.signedUrl ?? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl,
          };
        })
      );

      const validLinks = links.filter((link): link is { label: string; url: string } => link !== null);
      if (validLinks.length > 0) {
        linksByEntryId.set(entryId, { kind: "attachment-links", links: validLinks });
      }
    })
  );

  return linksByEntryId;
}

async function normalizeReviewValues(
  row: Record<string, unknown>
) {
  const values: Record<string, SubmittedReportFieldValue> = {};

  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined || value === "" || isInternalFieldKey(key)) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      values[humanizeKey(key)] = value;
    }
  }

  return values;
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
    title: row.title,
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
      "report_id, created_at, title, start_date, end_date, date_submitted, status, remarks, faculty_id, department_id"
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

export async function getSubmittedReportDetail({
  reportId,
  role,
  departmentId,
}: SubmittedReportDetailOptions): Promise<SubmittedReportDetail | null> {
  if (role !== "department_chair" && role !== "admin") {
    return null;
  }

  const reports = await getSubmittedReports({ role, departmentId });
  const report = reports.find((item) => item.report_id === reportId);

  if (!report) {
    return null;
  }

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true });

  if (formsError) throw formsError;

  const formRows = (forms ?? []) as FormRow[];
  const entryIds = formRows.map((form) => form.entry_id);

  if (entryIds.length === 0) {
    return { report, forms: [] };
  }

  const detailGroupsByEntryId = new Map<number, SubmittedReportFormGroup[]>();
  const typeByEntryId = new Map<number, string>();
  const attachmentLinksByEntryId = await getSupportingDocumentLinks(entryIds);

  await Promise.all(
    DETAIL_TABLES.map(async (config) => {
      const { data, error } = await supabase
        .from(config.table)
        .select("*")
        .in("entry_id", entryIds);

      if (error) {
        console.warn(`Failed to fetch ${config.table} for report ${reportId}:`, error);
        return;
      }

      for (const row of (data ?? []) as Record<string, unknown>[]) {
        const entryId = Number(row.entry_id);
        if (!Number.isFinite(entryId)) continue;

        const values = await normalizeReviewValues(row);
        const currentGroups = detailGroupsByEntryId.get(entryId) ?? [];

        detailGroupsByEntryId.set(entryId, [
          ...currentGroups,
          { label: config.label, values },
        ]);

        if (!typeByEntryId.has(entryId) && config.type !== "Supporting Documents") {
          typeByEntryId.set(entryId, config.type);
        }
      }
    })
  );

  const normalizedForms = await Promise.all(
    formRows.map(async (form) => {
      const baseValues = await normalizeReviewValues(
        form as unknown as Record<string, unknown>
      );
      const attachmentLinks = attachmentLinksByEntryId.get(form.entry_id);
      const attachmentGroup = attachmentLinks
        ? [{ label: "Supporting Documents", values: { Attachments: attachmentLinks } }]
        : [];
      const groups = Object.keys(baseValues).length > 0
        ? [
            { label: "Form Information", values: baseValues },
            ...(detailGroupsByEntryId.get(form.entry_id) ?? []),
            ...attachmentGroup,
          ]
        : [
            ...(detailGroupsByEntryId.get(form.entry_id) ?? []),
            ...attachmentGroup,
          ];

      return {
        entry_id: form.entry_id,
        title:
          form.title?.trim() ||
          typeByEntryId.get(form.entry_id) ||
          "Untitled form",
        type: typeByEntryId.get(form.entry_id) ?? "Unclassified Form",
        groups,
      };
    })
  );

  return {
    report,
    forms: normalizedForms,
  };
}

export async function updateSubmittedReport({
  reportId,
  title,
  startDate,
  endDate,
  remarks,
}: SubmittedReportUpdate) {
  const { data, error } = await supabase
    .from("accomplishment_reports")
    .update({
      title,
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
  reportId,
  status,
  remarks,
}: ReviewUpdateInput) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const [reviewResult, reportResult] = await Promise.all([
    supabase
      .from("reviews")
      .update({
        status,
        remarks: remarks ?? null,
        review_date: new Date().toISOString().slice(0, 10),
        reviewed_by: userData.user.id,
      })
      .eq("reviews_id", reviewId)
      .select()
      .single(),
    supabase
      .from("accomplishment_reports")
      .update({ status: "reviewed" })
      .eq("report_id", reportId)
      .select("report_id")
      .single(),
  ]);

  if (reviewResult.error) throw reviewResult.error;
  if (reportResult.error) throw reportResult.error;
  return reviewResult.data;
}
