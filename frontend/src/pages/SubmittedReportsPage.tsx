import { Fragment, useMemo, useState } from "react";
import { Eye, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ReviewStatus } from "@/api/reports";
import type { SubmittedReport } from "@/api/submitted-reports";
import { useSubmittedReports } from "@/hooks/use-submitted-reports";
import { useAuth } from "@/hooks/use-auth";

type StatusFilter = "all" | "pending" | "reviewed";

const statusLabels: Record<StatusFilter, string> = {
  all: "All",
  pending: "Pending",
  reviewed: "Reviewed",
};

const reviewStatusLabels: Record<ReviewStatus, string> = {
  approved: "Approved",
  partially_approved: "Partially approved",
};

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
}

function getFacultyName(report: SubmittedReport) {
  const name = [report.faculty_first_name, report.faculty_last_name]
    .filter(Boolean)
    .join(" ");

  return name || report.faculty_email || "Unknown faculty";
}

function getReportTitle(report: SubmittedReport) {
  if (report.title?.trim()) {
    return report.title;
  }

  const period =
    report.start_date || report.end_date
      ? `${formatDate(report.start_date)} - ${formatDate(report.end_date)}`
      : "Unspecified period";

  return `Report #${report.report_id} | ${period}`;
}

function getStatusBadge(report: SubmittedReport) {
  if (report.status === "reviewed") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
        Reviewed
      </Badge>
    );
  }

  return (
    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
      Pending
    </Badge>
  );
}

export default function SubmittedReportsPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const submittedReportsQuery = useSubmittedReports();

  const reports = useMemo(
    () => submittedReportsQuery.data ?? [],
    [submittedReportsQuery.data]
  );

  const departments = useMemo(() => {
    const departmentNames = reports
      .map((report) => report.department_name)
      .filter((name): name is string => Boolean(name));

    return Array.from(new Set(departmentNames)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === "all" || report.status === statusFilter;
      const matchesDepartment =
        role !== "admin" ||
        departmentFilter === "all" ||
        report.department_name === departmentFilter;
      const searchableText = [
        report.report_id,
        report.title,
        getFacultyName(report),
        report.faculty_email,
        report.department_name,
        report.remarks,
        report.latest_review_remarks,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        matchesDepartment &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [departmentFilter, reports, role, search, statusFilter]);

  const summary = useMemo(
    () => ({
      all: reports.length,
      pending: reports.filter((report) => report.status === "pending").length,
      reviewed: reports.filter((report) => report.status === "reviewed").length,
    }),
    [reports]
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Report Submissions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review and manage submitted faculty accomplishment reports.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => void submittedReportsQuery.refetch()}
              disabled={submittedReportsQuery.isFetching}
            >
              <RefreshCw
                size={14}
                className={submittedReportsQuery.isFetching ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {(["all", "pending", "reviewed"] as StatusFilter[]).map(
              (status) => (
                <button
                  key={status}
                  className={`rounded-lg border bg-background p-4 text-left transition-colors ${
                    statusFilter === status
                      ? "border-[#6b0f1a] ring-1 ring-[#6b0f1a]"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  <div className="text-xs font-medium text-muted-foreground">
                    {statusLabels[status]}
                  </div>
                  <div className="mt-1 text-2xl font-bold">
                    {summary[status]}
                  </div>
                </button>
              )
            )}
          </div>

          {submittedReportsQuery.isError ? (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Unable to load submitted reports. Please refresh the page or try
              again later.
            </div>
          ) : null}

          <div className="rounded-lg border bg-background p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative min-w-64 flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search title, faculty, department, remarks, or report ID"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              {role === "admin" ? (
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="text-right">Forms / Entries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    return (
                      <Fragment key={report.report_id}>
                        <TableRow key={report.report_id}>
                          <TableCell className="font-medium">
                            {getReportTitle(report)}
                          </TableCell>
                          <TableCell>
                            <div>{getFacultyName(report)}</div>
                            <div className="text-xs text-muted-foreground">
                              {report.faculty_email ?? "No email"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {report.department_name ?? "Unassigned"}
                          </TableCell>
                          <TableCell>{formatDate(report.date_submitted)}</TableCell>
                          <TableCell>{getStatusBadge(report)}</TableCell>
                          <TableCell>
                            {report.latest_review_status ? (
                              <Badge variant="outline">
                                {reviewStatusLabels[report.latest_review_status]}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No review
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {report.entry_count}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                navigate(
                                  `/report-submissions/${report.report_id}/review`
                                )
                              }
                            >
                              <Eye size={14} />
                              Open Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}

                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-32 text-center text-sm text-muted-foreground"
                      >
                        No submitted reports match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
