import type { Alignment, Cell, Row, Worksheet } from "exceljs";
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

  return `${system}_${lastName}_${reportTitle}.xlsx`;
}

function safeCellText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const text =
    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);

  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function formatDateForExport(value?: string | null) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getSourceLabel(table: string) {
  return table
    .replace(/^(isip|pbms)_/i, "")
    .replace(/_forms$/i, "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function styleWorksheet(worksheet: Worksheet) {
  worksheet.properties.defaultRowHeight = 22;
  worksheet.views = [{ state: "frozen", ySplit: 4 }];
  worksheet.pageSetup = {
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.45,
      right: 0.45,
      top: 0.5,
      bottom: 0.5,
      header: 0.25,
      footer: 0.25,
    },
  };
  worksheet.columns = [
    { key: "fieldA", width: 28 },
    { key: "valueA", width: 42 },
    { key: "fieldB", width: 28 },
    { key: "valueB", width: 42 },
  ];
}

function applyThinBorder(cell: Cell) {
  cell.border = {
    top: { style: "thin", color: { argb: "FFE5E7EB" } },
    left: { style: "thin", color: { argb: "FFE5E7EB" } },
    bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    right: { style: "thin", color: { argb: "FFE5E7EB" } },
  };
}

function styleRangeRow(
  row: Row,
  options: {
    fill?: string;
    fontColor?: string;
    bold?: boolean;
    size?: number;
    alignment?: Partial<Alignment>;
  } = {}
) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = {
      name: "Arial",
      size: options.size ?? 10,
      bold: options.bold,
      color: { argb: options.fontColor ?? "FF111827" },
    };
    cell.alignment = {
      vertical: "middle",
      wrapText: true,
      ...options.alignment,
    };
    if (options.fill) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: options.fill },
      };
    }
    applyThinBorder(cell);
  });
}

function addMergedSectionHeader(
  worksheet: Worksheet,
  title: string,
  options: { fill?: string; fontColor?: string } = {}
) {
  const row = worksheet.addRow([title, "", "", ""]);
  worksheet.mergeCells(row.number, 1, row.number, 4);
  row.height = 26;
  styleRangeRow(row, {
    fill: options.fill ?? "FF6B0F1A",
    fontColor: options.fontColor ?? "FFFFFFFF",
    bold: true,
    size: 12,
  });
  return row;
}

function addSpacer(worksheet: Worksheet, height = 8) {
  const row = worksheet.addRow([]);
  row.height = height;
}

function addFieldRow(
  worksheet: Worksheet,
  label: string,
  value: unknown,
  labelB = "",
  valueB: unknown = ""
) {
  const row = worksheet.addRow([
    label,
    safeCellText(value),
    labelB,
    safeCellText(valueB),
  ]);

  [1, 3].forEach((index) => {
    const cell = row.getCell(index);
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF374151" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
  });

  [2, 4].forEach((index) => {
    row.getCell(index).font = { name: "Arial", size: 10, color: { argb: "FF111827" } };
  });

  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.alignment = { vertical: "top", wrapText: true };
    applyThinBorder(cell);
  });
}

function addFieldRows(
  worksheet: Worksheet,
  values: Record<string, unknown>
) {
  const entries = Object.entries(values);

  for (let index = 0; index < entries.length; index += 2) {
    const [labelA, valueA] = entries[index];
    const [labelB, valueB] = entries[index + 1] ?? ["", ""];

    addFieldRow(worksheet, labelA, valueA, labelB, valueB);
  }
}

function addAttachmentRows(
  worksheet: Worksheet,
  attachmentLinks: string[]
) {
  addMergedSectionHeader(worksheet, "Attachments", {
    fill: "FFF3F4F6",
    fontColor: "FF374151",
  });

  if (attachmentLinks.length === 0) {
    addFieldRow(worksheet, "Links", "No attachments");
    return;
  }

  attachmentLinks.forEach((url, index) => {
    const row = worksheet.addRow([`Attachment ${index + 1}`, "", "", ""]);
    worksheet.mergeCells(row.number, 2, row.number, 4);

    const labelCell = row.getCell(1);
    labelCell.value = `Attachment ${index + 1}`;
    labelCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF374151" } };
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };

    const linkCell = row.getCell(2);
    linkCell.value = { text: url, hyperlink: url };
    linkCell.font = { name: "Arial", size: 10, color: { argb: "FF2563EB" }, underline: true };
    linkCell.alignment = { vertical: "top", wrapText: true };

    row.eachCell({ includeEmpty: true }, applyThinBorder);
  });
}

type ExcelJSModule = typeof import("exceljs");

function buildWorkbook(
  ExcelJSRuntime: ExcelJSModule,
  report: ExportableReport,
  system: ExportSystem,
  forms: Record<string, unknown>[],
  detailsByEntryId: Map<number, ExportDetail[]>
) {
  const workbook = new ExcelJSRuntime.Workbook();
  workbook.creator = "CMSC127 Accomplishment Reporting System";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet(`${system.toUpperCase()} Record`, {
    properties: { tabColor: { argb: system === "isip" ? "FF6B0F1A" : "FF1F2937" } },
  });
  styleWorksheet(worksheet);

  const titleRow = worksheet.addRow([
    `${system.toUpperCase()} Accomplishment Record`,
    "",
    "",
    "",
  ]);
  worksheet.mergeCells(titleRow.number, 1, titleRow.number, 4);
  titleRow.height = 34;
  styleRangeRow(titleRow, {
    fill: "FF6B0F1A",
    fontColor: "FFFFFFFF",
    bold: true,
    size: 18,
    alignment: { horizontal: "center", vertical: "middle" },
  });

  const subtitleRow = worksheet.addRow([
    safeCellText(report.title || "Untitled report"),
    "",
    "",
    "",
  ]);
  worksheet.mergeCells(subtitleRow.number, 1, subtitleRow.number, 4);
  subtitleRow.height = 26;
  styleRangeRow(subtitleRow, {
    fill: "FFF7E8EB",
    fontColor: "FF6B0F1A",
    bold: true,
    size: 12,
    alignment: { horizontal: "center", vertical: "middle" },
  });

  addSpacer(worksheet);
  addMergedSectionHeader(worksheet, "Report Summary");
  addFieldRows(worksheet, {
    Title: report.title ?? "",
    "Full Name of Submitter": report.faculty_name,
    Email: report.faculty_email ?? "",
    Department: report.department_name ?? "",
    College: report.college_name ?? "",
    "Reporting Period": `${formatDateForExport(report.start_date)} - ${formatDateForExport(report.end_date)}`,
    "Date Submitted": formatDateForExport(report.date_submitted),
    "Review Date": formatDateForExport(report.latest_review_date),
    Status: "Approved",
    "Entry Count": report.entry_count ?? forms.length,
    Remarks: report.remarks ?? "",
  });

  forms.forEach((form, index) => {
    const entryId = Number(form.entry_id);
    const details = detailsByEntryId.get(entryId) ?? [];
    if (details.length === 0) return;

    addSpacer(worksheet, 12);
    addMergedSectionHeader(
      worksheet,
      `Entry ${index + 1}: ${safeCellText(form.title || "Untitled entry")}`,
      { fill: "FF111827" }
    );
    addFieldRows(worksheet, {
      Title: form.title ?? "",
      Description: form.description ?? "",
      Author: form.author ?? "",
      "Entry ID": entryId,
    });

    for (const detail of details) {
      addMergedSectionHeader(worksheet, getSourceLabel(detail.sourceTable), {
        fill: "FFE5E7EB",
        fontColor: "FF111827",
      });
      addFieldRows(worksheet, detail.fields);
      addAttachmentRows(worksheet, detail.attachmentLinks);
    }
  });

  worksheet.eachRow((row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { vertical: "top", wrapText: true, ...cell.alignment };
    });
  });

  return workbook;
}

export async function buildApprovedReportXlsx(report: ExportableReport, system: ExportSystem) {
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
          console.warn(`Failed to fetch ${tableConfig.table} for XLSX export:`, error);
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

  const ExcelJSRuntime = await import("exceljs");
  const workbook = buildWorkbook(
    ExcelJSRuntime,
    report,
    system,
    typedForms,
    detailsByEntryId
  );

  return workbook.xlsx.writeBuffer();
}

export function downloadXlsx(filename: string, workbookBuffer: BlobPart) {
  const blob = new Blob([workbookBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
