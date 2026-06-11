"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  buildApprovedReportXlsx,
  downloadXlsx,
  getApprovedExportReports,
  getExportFilename,
  type ExportableReport,
  type ExportSystem,
} from "@/api/export-records";

function formatDate(value?: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getReportTitle(report: ExportableReport) {
  if (report.title?.trim()) {
    return report.title;
  }

  return "Untitled report";
}

export default function ExportsRecordsPage() {
  const { role, isAdmin, isChair } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [exportSystem, setExportSystem] = useState<ExportSystem>("pbms");
  const [isExporting, setIsExporting] = useState(false);

  const reportsQuery = useQuery({
    queryKey: ["export-records", role],
    queryFn: () => getApprovedExportReports(role),
    enabled: Boolean(role),
  });

  const approvedReports = useMemo(() => reportsQuery.data ?? [], [reportsQuery.data]);
  const selected = useMemo(
    () => approvedReports.find((report) => report.report_id === selectedId) ?? null,
    [approvedReports, selectedId]
  );

  async function handleExport() {
    if (!selected) return;

    setIsExporting(true);
    try {
      const workbook = await buildApprovedReportXlsx(selected, exportSystem);
      downloadXlsx(getExportFilename(exportSystem, selected), workbook);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Export Records
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Generate presentation-ready Excel workbooks for approved accomplishment reports.
                Each export is organized for review, printing, and archival.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => void reportsQuery.refetch()}
              disabled={reportsQuery.isFetching}
            >
              <RefreshCw
                size={14}
                className={reportsQuery.isFetching ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="overflow-hidden rounded-lg border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 px-5 py-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Approved Reports
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select one report, then choose the export format on the right.
                  </p>
                </div>
                <Badge variant="outline">{approvedReports.length} available</Badge>
              </div>

              {reportsQuery.isLoading ? (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                  Loading approved reports...
                </div>
              ) : reportsQuery.isError ? (
                <div className="px-6 py-12 text-center text-sm text-destructive">
                  Unable to load exportable reports.
                </div>
              ) : approvedReports.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-medium">No approved reports available</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Reports appear here only after an approved review is linked.
                  </p>
                </div>
              ) : (
                approvedReports.map((report) => {
                  const isSelected = selectedId === report.report_id;

                  return (
                    <button
                      key={report.report_id}
                      type="button"
                      onClick={() => setSelectedId(report.report_id)}
                      className={`flex w-full min-w-0 items-start gap-4 border-b px-5 py-4 text-left transition hover:bg-muted/40 ${isSelected
                          ? "border-l-4 border-l-[#6b0f1a] bg-[#6b0f1a]/5"
                          : ""
                        }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium">{getReportTitle(report)}</div>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            Approved
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {report.faculty_name}
                          {report.faculty_email ? ` | ${report.faculty_email}` : ""}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {formatDate(report.start_date)} - {formatDate(report.end_date)}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{report.entry_count} entries</Badge>
                          {(isAdmin || isChair) && (
                            <Badge variant="outline">
                              {report.department_name ?? "Unassigned department"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <aside className="h-fit rounded-lg border bg-background">
              <div className="border-b bg-muted/40 px-5 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Workbook Export
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Files are generated as formatted .xlsx workbooks with grouped report and form sections.
                </p>
              </div>

              {!selected ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                  <FileSpreadsheet className="mx-auto mb-3 h-8 w-8 text-muted-foreground/70" />
                  Select an approved report to export.
                </div>
              ) : (
                <div className="space-y-5 p-5">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-[#6b0f1a]/10 p-2 text-[#6b0f1a]">
                        <FileSpreadsheet size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{getReportTitle(selected)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {selected.faculty_name}
                          {selected.faculty_email ? ` | ${selected.faculty_email}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Department</span>
                        <span className="text-right font-medium">{selected.department_name ?? "Unassigned"}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Review date</span>
                        <span className="text-right font-medium">{formatDate(selected.latest_review_date)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Entries</span>
                        <span className="text-right font-medium">{selected.entry_count}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Export Source
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                    {(["pbms", "isip"] as const).map((system) => (
                      <Button
                        key={system}
                        type="button"
                        variant={exportSystem === system ? "default" : "outline"}
                        className={
                          exportSystem === system
                            ? "bg-[#6b0f1a] uppercase hover:bg-[#5a0a0a]"
                            : "uppercase"
                        }
                        onClick={() => setExportSystem(system)}
                      >
                        {system} XLSX
                      </Button>
                    ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
                    The workbook includes a report summary, grouped entry sections, formatted field tables,
                    and clickable attachment links.
                  </div>

                  <Button
                    className="w-full gap-2 bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                    onClick={() => void handleExport()}
                    disabled={isExporting}
                  >
                    <Download size={15} />
                    {isExporting
                      ? "Preparing workbook..."
                      : `Download ${exportSystem.toUpperCase()} XLSX`}
                  </Button>

                  <p className="break-words text-center text-xs text-muted-foreground">
                    {getExportFilename(exportSystem, selected)}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
