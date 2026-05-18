import { supabase } from "@/lib/supabase/client";
import { getAccessibleReports } from "@/api/reports";
import type { AppRole } from "@/api/profile";
import { STORAGE_BUCKETS } from "@/lib/storage-constants";

export type ExportSystem = "isip" | "pbms";

export type ExportableReport = Awaited<ReturnType<typeof getAccessibleReports>>[number] & {
  department_name: string | null;
  college_name: string | null;
  faculty_email: string | null;
  faculty_name: string;
  faculty_last_name: string | null;
  export_role: AppRole | null;
};

type DetailTableConfig = {
  table: string;
  attachmentBuckets?: Record<string, string>;
};

type ExportDetail = {
  sourceTable: string;
  fields: Record<string, unknown>;
  attachmentLinks: string[];
};

type CsvRow = [string, string, unknown];

type DepartmentRow = {
  department_id: number;
  department_name: string | null;
  college_name: string | null;
};

type UserRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  department_id: number | null;
};

const EXPORT_TABLES: Record<ExportSystem, DetailTableConfig[]> = {
  isip: [
    { table: "isip_publication_forms", attachmentBuckets: { publication_proof: STORAGE_BUCKETS.FORM_A } },
    { table: "isip_research_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_B } },
    { table: "isip_oral_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_C } },
    { table: "isip_patents_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_D } },
    { table: "isip_creative_work_forms", attachmentBuckets: { research_proof: STORAGE_BUCKETS.FORM_E } },
    { table: "isip_awards_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_F } },
    { table: "isip_trainings_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_G } },
    { table: "isip_extension_programs_forms", attachmentBuckets: { program_description: STORAGE_BUCKETS.FORM_H } },
    { table: "isip_partnership_forms" },
    { table: "isip_authorship_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_J } },
    { table: "isip_other_accomplishments_forms", attachmentBuckets: { attachments: STORAGE_BUCKETS.FORM_K } },
  ],
  pbms: [
    { table: "pbms_publication_forms", attachmentBuckets: { utilization_proof: STORAGE_BUCKETS.FORM_A } },
    { table: "pbms_research_forms" },
    { table: "pbms_oral_forms" },
    { table: "pbms_patents_forms" },
    { table: "pbms_creative_work_forms", attachmentBuckets: { utilization_proof: STORAGE_BUCKETS.FORM_E } },
    { table: "pbms_trainings_forms" },
    { table: "pbms_extension_programs_forms" },
    { table: "pbms_partnerships_forms", attachmentBuckets: { partnership_agreement: STORAGE_BUCKETS.FORM_I } },
    { table: "pbms_other_accomplishments_forms" },
  ],
};

const OMITTED_EXPORT_FIELDS = new Set([
  "report_id",
  "entry_id",
  "created_at",
  "form_type_id",
  "submitted_by",
  "isip_submitted_by",
  "isip_id",
]);

function csvEscape(value: unknown) {
  const rawText =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  const text = /^[=+\-@]/.test(rawText) ? `'${rawText}` : rawText;

  return `"${text.replaceAll('"', '""')}"`;
}

function sanitizeFilenamePart(value: string | null | undefined, fallback: string) {
  const sanitized = (value ?? "")
    .trim()
    .replaceAll(/[^a-z0-9]+/gi, "_")
    .replaceAll(/^_+|_+$/g, "")
    .toLowerCase();

  return sanitized || fallback;
}

function parseStoragePaths(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((path): path is string => typeof path === "string" && path.trim().length > 0);
  }

  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((path): path is string => typeof path === "string" && path.trim().length > 0);
    }
  } catch {
    // Attachment columns also store a single raw storage path.
  }

  return [trimmed];
}

async function getAttachmentUrls(bucket: string, value: unknown) {
  const paths = parseStoragePaths(value);

  return Promise.all(
    paths.map(async (path) => {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);

      if (error) {
        console.warn(`Failed to create signed URL for ${bucket}/${path}:`, error);
      }

      return data?.signedUrl ?? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
    })
  );
}

function humanizeFieldName(key: string) {
  return key
    .replace(/^(isip|pbms)_/i, "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function normalizeDetailRow(
  tableConfig: DetailTableConfig,
  row: Record<string, unknown>
) {
  const fields: Record<string, unknown> = {};
  const attachmentLinks: string[] = [];

  for (const [key, value] of Object.entries(row)) {
    if (OMITTED_EXPORT_FIELDS.has(key)) continue;

    const bucket = tableConfig.attachmentBuckets?.[key];

    if (bucket) {
      attachmentLinks.push(...(await getAttachmentUrls(bucket, value)));
      continue;
    }

    fields[humanizeFieldName(key)] = value ?? "";
  }

  return {
    sourceTable: tableConfig.table,
    fields,
    attachmentLinks,
  } satisfies ExportDetail;
}

function csvRow(row: CsvRow) {
  return row.map(csvEscape).join(",");
}

function addFieldRows(rows: CsvRow[], section: string, values: Record<string, unknown>) {
  for (const [field, value] of Object.entries(values)) {
    rows.push([section, field, value ?? ""]);
  }
}

function buildVerticalRows(
  report: ExportableReport,
  forms: Record<string, unknown>[],
  detailsByEntryId: Map<number, ExportDetail[]>
) {
  const rows: CsvRow[] = [];

  rows.push(["REPORT SUMMARY", "", ""]);
  addFieldRows(rows, "REPORT SUMMARY", {
    Title: report.title ?? "",
    "Full Name of Submitter": report.faculty_name,
    Email: report.faculty_email ?? "",
    Department: report.department_name ?? "",
    College: report.college_name ?? "",
    "Start Date": report.start_date ?? "",
    "End Date": report.end_date ?? "",
    "Date Submitted": report.date_submitted ?? "",
    Remarks: report.remarks ?? "",
  });

  for (const form of forms) {
    const entryId = Number(form.entry_id);
    const details = detailsByEntryId.get(entryId) ?? [];
    if (details.length === 0) continue;

    rows.push(["", "", ""]);
    rows.push(["FORM / ENTRY", "", ""]);
    addFieldRows(rows, "FORM / ENTRY", {
      Title: form.title ?? "",
      Description: form.description ?? "",
      Author: form.author ?? "",
    });

    for (const detail of details) {
      rows.push(["FORM-SPECIFIC FIELDS", "", detail.sourceTable]);
      addFieldRows(rows, "FORM-SPECIFIC FIELDS", detail.fields);

      rows.push(["ATTACHMENTS", "", ""]);
      if (detail.attachmentLinks.length === 0) {
        rows.push(["ATTACHMENTS", "Links", ""]);
      } else {
        detail.attachmentLinks.forEach((url, index) => {
          rows.push(["ATTACHMENTS", `Link ${index + 1}`, url]);
        });
      }
    }
  }

  return rows;
}

function generateVerticalCsv(rows: CsvRow[]) {
  return [
    csvRow(["Section", "Field", "Value"]),
    ...rows.map(csvRow),
  ].join("\n");
}

export async function getApprovedExportReports(role: AppRole | null) {
  if (!role) return [];

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) return [];

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, department_id")
    .eq("id", userData.user.id)
    .single();

  if (profileError) throw profileError;

  const reports = (await getAccessibleReports({ ownOnly: false })).filter(
    (report) => report.latest_review_status === "approved"
  );
  const roleFilteredReports = reports.filter((report) => {
    if (role === "admin") return true;
    if (role === "department_chair") return report.department_id === profile.department_id;

    return report.faculty_id === userData.user.id;
  });

  const departmentIds = Array.from(
    new Set(roleFilteredReports.map((report) => report.department_id).filter((id): id is number => id !== null))
  );
  const facultyIds = Array.from(
    new Set(roleFilteredReports.map((report) => report.faculty_id).filter((id): id is string => Boolean(id)))
  );

  const { data: users } = facultyIds.length
    ? await supabase
        .from("users")
        .select("id, first_name, last_name, email, department_id")
        .in("id", facultyIds)
    : { data: [] };
  const typedUsers = (users ?? []) as UserRow[];
  const effectiveDepartmentIds = Array.from(
    new Set([
      ...departmentIds,
      ...typedUsers.map((user) => user.department_id).filter((id): id is number => id !== null),
    ])
  );
  const { data: departments } = effectiveDepartmentIds.length
    ? await supabase
        .from("departments")
        .select("department_id, department_name, college_name")
        .in("department_id", effectiveDepartmentIds)
    : { data: [] };

  const departmentById = new Map(
    ((departments ?? []) as DepartmentRow[]).map((department) => [
      department.department_id,
      department,
    ])
  );
  const userById = new Map(typedUsers.map((user) => [user.id, user]));

  return roleFilteredReports.map((report) => {
    const user = report.faculty_id ? userById.get(report.faculty_id) : null;
    const departmentId = report.department_id ?? user?.department_id ?? null;
    const department = departmentId
      ? departmentById.get(departmentId) ?? null
      : null;
    const facultyName =
      [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
      user?.email ||
      "Unknown faculty";

    return {
      ...report,
      department_name: department?.department_name ?? null,
      college_name: department?.college_name ?? null,
      faculty_email: user?.email ?? null,
      faculty_name: facultyName,
      faculty_last_name: user?.last_name ?? null,
      export_role: role,
    };
  });
}

export function getExportFilename(system: ExportSystem, report: ExportableReport) {
  const lastName = sanitizeFilenamePart(report.faculty_last_name ?? report.faculty_name, "unknown_user");
  const reportTitle = sanitizeFilenamePart(report.title, "untitled_report");

  return `${system}_${lastName}_${reportTitle}.csv`;
}

export async function buildApprovedReportCsv(report: ExportableReport, system: ExportSystem) {
  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("*")
    .eq("report_id", report.report_id)
    .order("created_at", { ascending: true });

  if (formsError) throw formsError;

  const typedForms = (forms ?? []) as Record<string, unknown>[];
  const entryIds = typedForms.map((form) => Number(form.entry_id));
  const detailsByEntryId = new Map<number, ExportDetail[]>();

  if (entryIds.length > 0) {
    await Promise.all(
      EXPORT_TABLES[system].map(async (tableConfig) => {
        const { data, error } = await supabase
          .from(tableConfig.table)
          .select("*")
          .in("entry_id", entryIds);

        if (error) {
          console.warn(`Failed to fetch ${tableConfig.table} for CSV export:`, error);
          return;
        }

        for (const row of data ?? []) {
          const entryId = Number(row.entry_id);
          const normalized = await normalizeDetailRow(
            tableConfig,
            row as Record<string, unknown>
          );

          detailsByEntryId.set(entryId, [...(detailsByEntryId.get(entryId) ?? []), normalized]);
        }
      })
    );
  }

  const rows = buildVerticalRows(report, typedForms, detailsByEntryId);

  return `\uFEFF${generateVerticalCsv(rows)}`;
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
