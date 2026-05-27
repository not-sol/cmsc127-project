import type { Alignment, Cell, Row, Worksheet } from "exceljs";
import { supabase } from "@/lib/supabase/client";
import { getAccessibleReports } from "@/api/reports";
import type { AppRole } from "@/api/profile";

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
  label: string;
  formCode: string;
  documentTypes?: string[];
};

type ExportDetail = {
  sourceTable: string;
  label: string;
  formCode: string;
  fields: Record<string, unknown>;
  attachmentLinks: ExportAttachmentLink[];
};

type ExportAttachmentLink = {
  label: string;
  url: string;
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

type SupportingDocumentRow = {
  document_id: number;
  file_name: string | null;
  entry_id: number | null;
  bucket_id: string | null;
  storage_path: string | null;
  document_type: string | null;
};

const EXPORT_TABLES: Record<ExportSystem, DetailTableConfig[]> = {
  isip: [
    { table: "isip_publication_forms", label: "ISIP Publication", formCode: "Form A", documentTypes: ["publication_proof"] },
    { table: "isip_research_forms", label: "ISIP Research Grant", formCode: "Form B", documentTypes: ["attachments"] },
    { table: "isip_oral_forms", label: "ISIP Paper Presentation", formCode: "Form C", documentTypes: ["attachments"] },
    { table: "isip_patents_forms", label: "ISIP Patent", formCode: "Form D", documentTypes: ["attachments"] },
    { table: "isip_creative_work_forms", label: "ISIP Creative Work", formCode: "Form E", documentTypes: ["research_proof"] },
    { table: "isip_awards_forms", label: "ISIP Awards", formCode: "Form F", documentTypes: ["attachments"] },
    { table: "isip_trainings_forms", label: "ISIP Training", formCode: "Form G", documentTypes: ["attachments"] },
    { table: "isip_extension_programs_forms", label: "ISIP Extension Program", formCode: "Form H", documentTypes: ["program_description"] },
    { table: "isip_partnership_forms", label: "ISIP Partnership", formCode: "Form I" },
    { table: "isip_authorship_forms", label: "ISIP Authorship", formCode: "Form J", documentTypes: ["attachments"] },
    { table: "isip_other_accomplishments_forms", label: "ISIP Other Accomplishments", formCode: "Form K", documentTypes: ["attachments"] },
  ],
  pbms: [
    { table: "pbms_publication_forms", label: "PBMS Publication", formCode: "Form A", documentTypes: ["utilization_proof"] },
    { table: "pbms_research_forms", label: "PBMS Research Grant", formCode: "Form B" },
    { table: "pbms_oral_forms", label: "PBMS Paper Presentation", formCode: "Form C" },
    { table: "pbms_patents_forms", label: "PBMS Patent", formCode: "Form D" },
    { table: "pbms_creative_work_forms", label: "PBMS Creative Work", formCode: "Form E", documentTypes: ["utilization_proof"] },
    { table: "pbms_trainings_forms", label: "PBMS Training", formCode: "Form G" },
    { table: "pbms_extension_programs_forms", label: "PBMS Extension Program", formCode: "Form H" },
    { table: "pbms_partnerships_forms", label: "PBMS Partnership", formCode: "Form I", documentTypes: ["partnership_agreement"] },
    { table: "pbms_other_accomplishments_forms", label: "PBMS Other Accomplishments", formCode: "Form K" },
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

function humanizeFieldName(key: string) {
  return key
    .replace(/^(isip|pbms)_/i, "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDocumentLabel(document: SupportingDocumentRow, index: number) {
  if (document.file_name?.trim()) return document.file_name;
  if (document.storage_path?.trim()) {
    return document.storage_path.split("/").filter(Boolean).at(-1) ?? `Attachment ${index + 1}`;
  }

  return `Attachment ${index + 1}`;
}

async function createDocumentLink(document: SupportingDocumentRow, index: number) {
  const path = document.storage_path ?? document.file_name ?? "";
  const bucket = document.bucket_id;

  if (!path || !bucket) return null;

  if (/^https?:\/\//i.test(path)) {
    return { label: getDocumentLabel(document, index), url: path };
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    console.warn(`Failed to create signed URL for ${bucket}/${path}:`, error);
  }

  const url = data?.signedUrl ?? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  const label = getDocumentLabel(document, index);

  return { label, url };
}

async function getSupportingDocumentLinksByEntryId(
  entryIds: number[],
  system: ExportSystem
) {
  if (entryIds.length === 0) return new Map<number, ExportAttachmentLink[]>();

  const documentTypes = Array.from(
    new Set(EXPORT_TABLES[system].flatMap((config) => config.documentTypes ?? []))
  );

  if (documentTypes.length === 0) return new Map<number, ExportAttachmentLink[]>();

  let query = supabase
    .from("supporting_documents")
    .select("document_id, file_name, entry_id, bucket_id, storage_path, document_type")
    .in("entry_id", entryIds)
    .order("document_id", { ascending: true });

  query = query.in("document_type", documentTypes);

  const { data, error } = await query;

  if (error) {
    console.warn("Failed to fetch supporting documents for XLSX export:", error);
    return new Map<number, ExportAttachmentLink[]>();
  }

  const linksByEntryId = new Map<number, ExportAttachmentLink[]>();

  await Promise.all(
    ((data ?? []) as SupportingDocumentRow[]).map(async (document, index) => {
      if (!document.entry_id) return;

      const link = await createDocumentLink(document, index);
      if (!link) return;

      linksByEntryId.set(document.entry_id, [
        ...(linksByEntryId.get(document.entry_id) ?? []),
        link,
      ]);
    })
  );

  return linksByEntryId;
}

async function normalizeDetailRow(
  tableConfig: DetailTableConfig,
  row: Record<string, unknown>,
  attachmentLinks: ExportAttachmentLink[]
) {
  const fields: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    if (OMITTED_EXPORT_FIELDS.has(key)) continue;

    fields[humanizeFieldName(key)] = value ?? "";
  }

  return {
    sourceTable: tableConfig.table,
    label: tableConfig.label,
    formCode: tableConfig.formCode,
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

function getEntryFormLabel(details: ExportDetail[]) {
  const labels = details.map((detail) => `${detail.formCode} - ${detail.label}`);

  return Array.from(new Set(labels)).join(" / ") || "Unclassified Form";
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
  attachmentLinks: ExportAttachmentLink[]
) {
  addMergedSectionHeader(worksheet, "Attachments", {
    fill: "FFF3F4F6",
    fontColor: "FF374151",
  });

  if (attachmentLinks.length === 0) {
    addFieldRow(worksheet, "Links", "No attachments");
    return;
  }

  attachmentLinks.forEach((attachment, index) => {
    const row = worksheet.addRow([`Attachment ${index + 1}`, "", "", ""]);
    worksheet.mergeCells(row.number, 2, row.number, 4);

    const labelCell = row.getCell(1);
    labelCell.value = attachment.label || `Attachment ${index + 1}`;
    labelCell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF374151" } };
    labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };

    const linkCell = row.getCell(2);
    linkCell.value = { text: attachment.url, hyperlink: attachment.url };
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
      `Entry ${index + 1} | ${getEntryFormLabel(details)}`,
      { fill: "FF111827" }
    );
    const typeRow = worksheet.addRow([
      "Form Type",
      getEntryFormLabel(details),
      "Export Scope",
      system.toUpperCase(),
    ]);
    typeRow.height = 28;
    styleRangeRow(typeRow, {
      fill: "FFF7E8EB",
      fontColor: "FF6B0F1A",
      bold: true,
      size: 11,
    });
    addFieldRows(worksheet, {
      Title: form.title ?? "",
      Description: form.description ?? "",
      Author: form.author ?? "",
      "Entry ID": entryId,
    });

    for (const detail of details) {
      addMergedSectionHeader(worksheet, `${detail.formCode} - ${detail.label}`, {
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
  const attachmentLinksByEntryId = await getSupportingDocumentLinksByEntryId(
    entryIds,
    system
  );

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
            row as Record<string, unknown>,
            attachmentLinksByEntryId.get(entryId) ?? ([] as ExportAttachmentLink[])
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
