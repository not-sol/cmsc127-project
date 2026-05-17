import { supabase } from "@/lib/supabase/client";
import { getAccessibleReports } from "@/api/reports";
import type { AppRole } from "@/api/profile";

export type ExportableReport = Awaited<ReturnType<typeof getAccessibleReports>>[number] & {
  department_name: string | null;
  faculty_email: string | null;
  faculty_name: string;
};

const DETAIL_TABLES = [
  "isip_publication_forms",
  "pbms_publication_forms",
  "isip_research_forms",
  "pbms_research_forms",
  "isip_oral_forms",
  "pbms_oral_forms",
  "isip_patents_forms",
  "pbms_patents_forms",
  "isip_creative_work_forms",
  "pbms_creative_work_forms",
  "isip_awards_forms",
  "isip_trainings_forms",
  "pbms_trainings_forms",
  "isip_extension_programs_forms",
  "pbms_extension_programs_forms",
  "isip_partnership_forms",
  "pbms_partnerships_forms",
  "isip_authorship_forms",
  "isip_other_accomplishments_forms",
  "pbms_other_accomplishments_forms",
  "supporting_documents",
] as const;

function sourceSystem(table: string) {
  if (table.startsWith("isip_")) return "ISIP";
  if (table.startsWith("pbms_")) return "PBMS";
  if (table === "supporting_documents") return "SUPPORTING_DOCUMENT";
  return "BASE";
}

function humanizeKey(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function csvEscape(value: unknown) {
  const text =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replaceAll('"', '""')}"`;
}

export async function getApprovedExportReports(role: AppRole | null) {
  const reports = (await getAccessibleReports({ ownOnly: false })).filter(
    (report) => report.latest_review_status === "approved"
  );

  const departmentIds = Array.from(
    new Set(reports.map((report) => report.department_id).filter((id): id is number => id !== null))
  );
  const facultyIds = Array.from(
    new Set(reports.map((report) => report.faculty_id).filter((id): id is string => Boolean(id)))
  );

  const [{ data: departments }, { data: users }] = await Promise.all([
    departmentIds.length
      ? supabase
          .from("departments")
          .select("department_id, department_name")
          .in("department_id", departmentIds)
      : { data: [] },
    facultyIds.length
      ? supabase
          .from("users")
          .select("id, first_name, last_name, email")
          .in("id", facultyIds)
      : { data: [] },
  ]);

  const departmentById = new Map(
    (departments ?? []).map((department) => [
      department.department_id,
      department.department_name ?? null,
    ])
  );
  const userById = new Map((users ?? []).map((user) => [user.id, user]));

  return reports.map((report) => {
    const user = report.faculty_id ? userById.get(report.faculty_id) : null;
    const facultyName =
      [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
      user?.email ||
      "Unknown faculty";

    return {
      ...report,
      department_name: report.department_id
        ? departmentById.get(report.department_id) ?? null
        : null,
      faculty_email: user?.email ?? null,
      faculty_name: facultyName,
      export_role: role,
    };
  });
}

export async function buildApprovedReportCsv(report: ExportableReport) {
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("report_id", report.report_id)
    .order("created_at", { ascending: true });

  if (formsError) throw formsError;

  const entryIds = (forms ?? []).map((form) => form.entry_id);
  const rows: Record<string, unknown>[] = [];

  rows.push({
    RowType: "REPORT",
    SourceSystem: "REPORT",
    SourceTable: "accomplishment_reports",
    ReportId: report.report_id,
    ReportTitle: report.title ?? "",
    Department: report.department_name ?? "",
    Faculty: report.faculty_name,
    FacultyEmail: report.faculty_email ?? "",
    ReviewStatus: report.latest_review_status ?? "",
    ReviewDate: report.latest_review_date ?? "",
    Field: "Report Metadata",
    Value: report.remarks ?? "",
  });

  for (const form of forms ?? []) {
    for (const [key, value] of Object.entries(form)) {
      rows.push({
        RowType: "ENTRY",
        SourceSystem: "BASE",
        SourceTable: "forms",
        ReportId: report.report_id,
        EntryId: form.entry_id,
        Department: report.department_name ?? "",
        Faculty: report.faculty_name,
        Field: humanizeKey(key),
        Value: value,
      });
    }
  }

  if (entryIds.length > 0) {
    await Promise.all(
      DETAIL_TABLES.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .in("entry_id", entryIds);

        if (error) return;

        for (const row of data ?? []) {
          for (const [key, value] of Object.entries(row)) {
            rows.push({
              RowType: "ENTRY_DETAIL",
              SourceSystem: sourceSystem(table),
              SourceTable: table,
              ReportId: report.report_id,
              EntryId: row.entry_id,
              Department: report.department_name ?? "",
              Faculty: report.faculty_name,
              Field: humanizeKey(key),
              Value: value,
            });
          }
        }
      })
    );
  }

  const headers = [
    "RowType",
    "SourceSystem",
    "SourceTable",
    "ReportId",
    "ReportTitle",
    "EntryId",
    "Department",
    "Faculty",
    "FacultyEmail",
    "ReviewStatus",
    "ReviewDate",
    "Field",
    "Value",
  ];

  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
