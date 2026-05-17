import { Fragment, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import type { ReviewStatus } from "@/api/reports";
import type {
  SubmittedReport,
  SubmittedReportFormDetail,
} from "@/api/submitted-reports";
import {
  useCreateReviewDecision,
  useSubmittedReportDetail,
  useSubmittedReports,
  useUpdateReviewDecision,
} from "@/hooks/use-submitted-reports";

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

type ReviewDraft = {
  status: ReviewStatus;
  remarks: string;
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

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(formatValue).join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function getFormPreview(form: SubmittedReportFormDetail) {
  for (const group of form.groups) {
    const firstValue = Object.values(group.values).find(
      (value) => value !== null && value !== undefined && value !== ""
    );

    if (firstValue) return formatValue(firstValue);
  }

  return "No details recorded";
}

function FieldGrid({ values }: { values: Record<string, unknown> }) {
  const entries = Object.entries(values);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No values recorded for this section.
      </p>
    );
  }

  return (
    <dl className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-md border bg-muted/20 p-3">
          <dt className="break-words text-xs font-medium uppercase text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function getReportSummaryValues(report: SubmittedReport) {
  return {
    "Report ID": report.report_id,
    Faculty: getFacultyName(report),
    Email: report.faculty_email ?? "No email",
    Department: report.department_name ?? "Unassigned",
    College: report.college_name ?? "Unassigned",
    Status: report.status,
    "Start Date": formatDate(report.start_date),
    "End Date": formatDate(report.end_date),
    "Date Submitted": formatDate(report.date_submitted),
    "Attached Forms": report.entry_count,
    Remarks: report.remarks ?? "None",
    "Latest Review": report.latest_review_status
      ? reviewStatusLabels[report.latest_review_status]
      : "No review",
    "Latest Review Remarks": report.latest_review_remarks ?? "None",
    "Latest Review Date": formatDate(report.latest_review_date),
  };
}

export default function SubmittedReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [expandedReportId, setExpandedReportId] = useState<number | null>(null);
  const [selectedFormIds, setSelectedFormIds] = useState<Record<number, number>>(
    {}
  );
  const [reviewDrafts, setReviewDrafts] = useState<Record<number, ReviewDraft>>(
    {}
  );

  const submittedReportsQuery = useSubmittedReports();
  const submittedReportDetailQuery = useSubmittedReportDetail(expandedReportId);
  const createReviewMutation = useCreateReviewDecision();
  const updateReviewMutation = useUpdateReviewDecision();

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
        departmentFilter === "all" ||
        report.department_name === departmentFilter;
      const searchableText = [
        report.report_id,
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
  }, [departmentFilter, reports, search, statusFilter]);

  const summary = useMemo(
    () => ({
      all: reports.length,
      pending: reports.filter((report) => report.status === "pending").length,
      reviewed: reports.filter((report) => report.status === "reviewed").length,
    }),
    [reports]
  );

  function getReviewDraft(report: SubmittedReport) {
    return (
      reviewDrafts[report.report_id] ?? {
        status: report.latest_review_status ?? "approved",
        remarks: report.latest_review_remarks ?? "",
      }
    );
  }

  async function handleSubmitReview(report: SubmittedReport) {
    const draft = getReviewDraft(report);

    if (report.latest_review_id) {
      await updateReviewMutation.mutateAsync({
        reviewId: report.latest_review_id,
        reportId: report.report_id,
        status: draft.status,
        remarks: draft.remarks.trim() || undefined,
      });
      return;
    }

    await createReviewMutation.mutateAsync({
      reportId: report.report_id,
      status: draft.status,
      remarks: draft.remarks.trim() || undefined,
    });
  }

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
                  placeholder="Search faculty, department, remarks, or report ID"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

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
            </div>

            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
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
                    const isExpanded = expandedReportId === report.report_id;
                    const detailForms =
                      isExpanded &&
                      submittedReportDetailQuery.data?.report.report_id ===
                        report.report_id
                        ? submittedReportDetailQuery.data.forms
                        : null;
                    const displayedEntryCount = detailForms
                      ? detailForms.length
                      : report.entry_count;
                    const selectedFormId =
                      selectedFormIds[report.report_id] ??
                      detailForms?.[0]?.entry_id ??
                      null;
                    const selectedForm =
                      detailForms?.find((form) => form.entry_id === selectedFormId) ??
                      detailForms?.[0] ??
                      null;
                    const reviewDraft = getReviewDraft(report);
                    const isReviewPending =
                      createReviewMutation.isPending ||
                      updateReviewMutation.isPending;

                    return (
                      <Fragment key={report.report_id}>
                        <TableRow key={report.report_id}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                setExpandedReportId(
                                  isExpanded ? null : report.report_id
                                )
                              }
                            >
                              {isExpanded ? (
                                <ChevronDown size={15} />
                              ) : (
                                <ChevronRight size={15} />
                              )}
                            </Button>
                          </TableCell>
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
                            {displayedEntryCount}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                setExpandedReportId(
                                  isExpanded ? null : report.report_id
                                )
                              }
                            >
                              <Eye size={14} />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>

                        {isExpanded ? (
                          <TableRow key={`${report.report_id}-details`}>
                            <TableCell />
                            <TableCell colSpan={8}>
                              <div className="grid min-w-0 gap-6 py-4">
                                <div>
                                  <h3 className="text-base font-semibold">
                                    Full Report
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Review submitted report metadata, browse attached forms, and record the review decision.
                                  </p>
                                </div>

                                <Card className="rounded-lg">
                                  <CardHeader className="border-b">
                                    <CardTitle>Report Summary</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <FieldGrid
                                      values={{
                                        ...getReportSummaryValues(report),
                                        "Attached Forms": displayedEntryCount,
                                      }}
                                    />
                                  </CardContent>
                                </Card>

                                <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(18rem,22rem)_1fr]">
                                  <Card className="min-w-0 rounded-lg">
                                    <CardHeader className="border-b">
                                      <CardTitle className="flex items-center justify-between gap-3">
                                        <span>Forms / Entries</span>
                                        <Badge variant="outline">
                                          {displayedEntryCount}
                                        </Badge>
                                      </CardTitle>
                                      <p className="text-xs text-muted-foreground">
                                        Select a form to inspect its recorded values.
                                      </p>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      {submittedReportDetailQuery.isFetching ? (
                                        <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
                                          Loading form list...
                                        </div>
                                      ) : null}

                                      {submittedReportDetailQuery.isError ? (
                                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-4 text-sm text-destructive">
                                          Unable to load report form details.
                                        </div>
                                      ) : null}

                                      {detailForms?.length === 0 ? (
                                        <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
                                          No forms are attached to this report.
                                        </div>
                                      ) : null}

                                      {detailForms?.map((form, index) => {
                                        const isSelected =
                                          selectedForm?.entry_id === form.entry_id;

                                        return (
                                          <button
                                            key={form.entry_id}
                                            type="button"
                                            className={`w-full min-w-0 rounded-md border p-3 text-left transition-colors ${
                                              isSelected
                                                ? "border-[#6b0f1a] bg-[#6b0f1a]/5 ring-1 ring-[#6b0f1a]"
                                                : "bg-background hover:bg-muted/50"
                                            }`}
                                            onClick={() =>
                                              setSelectedFormIds((current) => ({
                                                ...current,
                                                [report.report_id]: form.entry_id,
                                              }))
                                            }
                                          >
                                            <div className="flex min-w-0 items-start justify-between gap-2">
                                              <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">
                                                  Form {index + 1}: {form.title}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                  <span>Entry #{form.entry_id}</span>
                                                  <Badge
                                                    variant="outline"
                                                    className="max-w-full truncate"
                                                  >
                                                    {form.type}
                                                  </Badge>
                                                </div>
                                              </div>
                                              <ChevronRight
                                                size={14}
                                                className="mt-0.5 shrink-0 text-muted-foreground"
                                              />
                                            </div>
                                            <p className="mt-2 line-clamp-2 break-words text-xs text-muted-foreground">
                                              {getFormPreview(form)}
                                            </p>
                                          </button>
                                        );
                                      })}
                                    </CardContent>
                                  </Card>

                                  <Card className="min-w-0 rounded-lg">
                                    <CardHeader className="border-b">
                                      <CardTitle className="flex min-w-0 flex-wrap items-center gap-2">
                                        {selectedForm ? (
                                          <>
                                            <span className="min-w-0 break-words">
                                              {selectedForm.title}
                                            </span>
                                            <Badge variant="outline">
                                              {selectedForm.type}
                                            </Badge>
                                          </>
                                        ) : (
                                          "Form Details"
                                        )}
                                      </CardTitle>
                                      {selectedForm ? (
                                        <p className="text-xs text-muted-foreground">
                                          Entry #{selectedForm.entry_id}
                                          {selectedForm.created_at
                                            ? ` | Created ${formatDate(selectedForm.created_at)}`
                                            : ""}
                                        </p>
                                      ) : (
                                        <p className="text-xs text-muted-foreground">
                                          Select a form from the list to view its details.
                                        </p>
                                      )}
                                    </CardHeader>
                                    <CardContent className="min-w-0 space-y-5">
                                      {selectedForm ? (
                                        selectedForm.groups.map((group) => (
                                          <section
                                            key={`${selectedForm.entry_id}-${group.label}`}
                                            className="min-w-0 space-y-2"
                                          >
                                            <h4 className="break-words text-sm font-semibold">
                                              {group.label}
                                            </h4>
                                            <FieldGrid values={group.values} />
                                          </section>
                                        ))
                                      ) : (
                                        <div className="rounded-md border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                                          No form selected.
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card className="min-w-0 rounded-lg">
                                  <CardHeader className="border-b">
                                    <CardTitle>Review Decision</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                      Submit or update the review outcome for this report.
                                    </p>
                                  </CardHeader>
                                  <CardContent className="grid min-w-0 gap-4 lg:grid-cols-[16rem_1fr_auto] lg:items-end">
                                    <label className="space-y-1.5 text-sm">
                                      <span className="font-medium">
                                        Outcome
                                      </span>
                                      <Select
                                        value={reviewDraft.status}
                                        onValueChange={(value) =>
                                          setReviewDrafts((current) => ({
                                            ...current,
                                            [report.report_id]: {
                                              ...reviewDraft,
                                              status: value as ReviewStatus,
                                            },
                                          }))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="approved">
                                            Approved
                                          </SelectItem>
                                          <SelectItem value="partially_approved">
                                            Partially approved
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </label>

                                    <label className="min-w-0 space-y-1.5 text-sm">
                                      <span className="font-medium">
                                        Remarks / comments
                                      </span>
                                      <Textarea
                                        className="min-h-24 resize-y"
                                        placeholder="Add optional review remarks"
                                        value={reviewDraft.remarks}
                                        onChange={(event) =>
                                          setReviewDrafts((current) => ({
                                            ...current,
                                            [report.report_id]: {
                                              ...reviewDraft,
                                              remarks: event.target.value,
                                            },
                                          }))
                                        }
                                      />
                                    </label>

                                    <Button
                                      className="gap-2 bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                                      onClick={() =>
                                        void handleSubmitReview(report)
                                      }
                                      disabled={isReviewPending}
                                    >
                                      <CheckCircle2 size={15} />
                                      {report.latest_review_id
                                        ? "Update Review"
                                        : "Submit Review"}
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : null}
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
