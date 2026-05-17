"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  buildApprovedReportCsv,
  downloadCsv,
  getApprovedExportReports,
  type ExportableReport,
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

  return `Report #${report.report_id}`;
}

function safeFilename(report: ExportableReport) {
  const department = report.department_name?.replaceAll(/[^a-z0-9]+/gi, "_") ?? "department";
  return `approved_report_${report.report_id}_${department}.csv`.toLowerCase();
}

export default function ExportsRecordsPage() {
  const { role, isAdmin, isChair } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const reportsQuery = useQuery({
    queryKey: ["export-records", role],
    queryFn: () => getApprovedExportReports(role),
    enabled: Boolean(role),
  });

  const approvedReports = reportsQuery.data ?? [];
  const selected = useMemo(
    () => approvedReports.find((report) => report.report_id === selectedId) ?? null,
    [approvedReports, selectedId]
  );

  async function handleExport() {
    if (!selected) return;

    setIsExporting(true);
    try {
      const csv = await buildApprovedReportCsv(selected);
      downloadCsv(safeFilename(selected), csv);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Export Records
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Export reports with an approved review decision as CSV.
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

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="overflow-hidden rounded-lg border bg-background">
              <div className="border-b bg-muted/40 px-5 py-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Approved Reports
                </h2>
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
                        <div className="font-medium">{getReportTitle(report)}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDate(report.start_date)} - {formatDate(report.end_date)}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{report.entry_count} entries</Badge>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            Approved
                          </Badge>
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

            <div className="rounded-lg border bg-background p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Export
              </h3>

              {!selected ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Select an approved report to export.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="font-medium">{getReportTitle(selected)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {selected.faculty_name}
                      {selected.faculty_email ? ` | ${selected.faculty_email}` : ""}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div>Department: {selected.department_name ?? "Unassigned"}</div>
                      <div>Review date: {formatDate(selected.latest_review_date)}</div>
                      <div>Entries: {selected.entry_count}</div>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2 bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                    onClick={() => void handleExport()}
                    disabled={isExporting}
                  >
                    <Download size={15} />
                    Download CSV
                  </Button>

                  <p className="break-words text-center text-xs text-muted-foreground">
                    {safeFilename(selected)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
