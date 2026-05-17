import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowUpDown,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";

import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAccessibleReports,
  updateReportStatus,
  type ReportStatus,
  type ReportSummary,
} from "@/api/reports";

const reportsQueryKey = ["reports"] as const;

const statusLabels: Record<ReportStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  reviewed: "Reviewed",
  archived: "Archived",
};

const statusClasses: Record<ReportStatus, string> = {
  draft: "bg-slate-100 text-slate-800 border-slate-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  reviewed: "bg-emerald-100 text-emerald-900 border-emerald-200",
  archived: "bg-zinc-200 text-zinc-800 border-zinc-300",
};

function formatDate(value?: string | null) {
  if (!value) return "Not submitted";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getReportTitle(report: ReportSummary) {
  if (report.remarks?.trim()) {
    return report.remarks.split(".")[0];
  }

  return `Report #${report.report_id}`;
}

function getReportingPeriod(report: ReportSummary) {
  if (!report.start_date && !report.end_date) return "No period set";
  return `${formatDate(report.start_date)} - ${formatDate(report.end_date)}`;
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: reportsQueryKey,
    queryFn: getAccessibleReports,
    refetchOnWindowFocus: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      reportId,
      status,
    }: {
      reportId: number;
      status: ReportStatus;
    }) => updateReportStatus(reportId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reportsQueryKey });
    },
  });

  const reports = reportsQuery.data ?? [];
  const activeReports = reports.filter((report) => report.status !== "archived");
  const archivedReports = reports.filter((report) => report.status === "archived");

  const filteredReports = useMemo(() => {
    const source = viewMode === "archived" ? archivedReports : activeReports;
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return source;

    return source.filter((report) =>
      [
        getReportTitle(report),
        getReportingPeriod(report),
        report.status ? statusLabels[report.status] : "",
        report.remarks ?? "",
        String(report.report_id),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [activeReports, archivedReports, search, viewMode]);

  const archiveReport = async (report: ReportSummary) => {
    if (
      !window.confirm(
        `Archive ${getReportTitle(report)}? It will move out of the active reports view.`
      )
    ) {
      return;
    }

    await statusMutation.mutateAsync({
      reportId: report.report_id,
      status: "archived",
    });
  };

  const restoreReport = async (report: ReportSummary) => {
    await statusMutation.mutateAsync({
      reportId: report.report_id,
      status: "draft",
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">My Accomplishment Reports</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Active reports are separated from archived reports for review and recovery.
              </p>
            </div>

            <Button
              size="sm"
              className="h-8 gap-1.5 text-sm bg-foreground text-background hover:bg-foreground/90"
              onClick={() => navigate("/reports/create-report")}
            >
              <Plus size={13} />
              Add New Report
            </Button>
          </div>

          <div className="rounded-lg border bg-background p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-md border bg-muted/30 p-1">
                <Button
                  type="button"
                  variant={viewMode === "active" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode("active")}
                >
                  Active
                  <span className="ml-2 rounded bg-background/25 px-1.5">
                    {activeReports.length}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "archived" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode("archived")}
                >
                  Archived
                  <span className="ml-2 rounded bg-background/25 px-1.5">
                    {archivedReports.length}
                  </span>
                </Button>
              </div>

              <div className="relative flex-1 min-w-64 max-w-sm">
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <Input
                  className="pl-8 h-8 text-sm"
                  placeholder="Search reports"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="flex-1" />

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-sm"
                onClick={() => void reportsQuery.refetch()}
                disabled={reportsQuery.isFetching}
              >
                <RefreshCw
                  size={13}
                  className={reportsQuery.isFetching ? "animate-spin" : ""}
                />
                Refresh
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Report</TableHead>
                  <TableHead className="text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      Reporting Period
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold">Date Submitted</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Forms</TableHead>
                  <TableHead className="text-xs font-semibold">Remarks</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm">
                      Loading reports...
                    </TableCell>
                  </TableRow>
                ) : reportsQuery.isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-destructive">
                      Failed to load reports.
                    </TableCell>
                  </TableRow>
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                      No {viewMode} reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const status = report.status ?? "draft";
                    const isArchived = status === "archived";

                    return (
                      <TableRow
                        key={report.report_id}
                        className={isArchived ? "bg-muted/40" : undefined}
                      >
                        <TableCell className="text-sm font-medium">
                          {getReportTitle(report)}
                          <div className="text-xs text-muted-foreground">
                            Report #{report.report_id}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {getReportingPeriod(report)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(report.date_submitted)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium ${statusClasses[status]}`}
                          >
                            {statusLabels[status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{report.entry_count}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {report.remarks || "No remarks"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="View report"
                              onClick={() => navigate("/reports/create-report")}
                            >
                              <Eye size={13} />
                            </Button>
                            {!isArchived ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  title="Edit report"
                                  onClick={() => navigate("/reports/create-report")}
                                >
                                  <Pencil size={13} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                  title="Archive report"
                                  onClick={() => void archiveReport(report)}
                                  disabled={statusMutation.isPending}
                                >
                                  <Archive size={13} />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                title="Restore as draft"
                                onClick={() => void restoreReport(report)}
                                disabled={statusMutation.isPending}
                              >
                                <RotateCcw size={13} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>
                Showing {filteredReports.length} of{" "}
                {viewMode === "archived" ? archivedReports.length : activeReports.length}{" "}
                {viewMode} reports
              </span>
              <span>
                Drafts: {activeReports.filter((report) => report.status === "draft").length}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
