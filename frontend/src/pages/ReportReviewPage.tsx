import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, RefreshCw } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import type { ReviewStatus } from "@/api/reports";
import type { SubmittedReport, SubmittedReportFormDetail } from "@/api/submitted-reports";
import {
  useCreateReviewDecision,
  useSubmittedReportDetail,
  useUpdateReviewDecision,
} from "@/hooks/use-submitted-reports";

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
  return (
    [report.faculty_first_name, report.faculty_last_name].filter(Boolean).join(" ") ||
    report.faculty_email ||
    "Unknown faculty"
  );
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function getEntryPreview(entry: SubmittedReportFormDetail) {
  for (const group of entry.groups) {
    const value = Object.values(group.values).find(
      (item) => item !== null && item !== undefined && item !== ""
    );
    if (value) return formatValue(value);
  }
  return "No details recorded";
}

function FieldGrid({ values }: { values: Record<string, unknown> }) {
  const entries = Object.entries(values);

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No values recorded.</p>;
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

function reportSummary(report: SubmittedReport, entryCount: number) {
  return {
    Title: report.title ?? "Untitled report",
    Faculty: getFacultyName(report),
    Email: report.faculty_email ?? "No email",
    Department: report.department_name ?? "Unassigned",
    College: report.college_name ?? "Unassigned",
    Status: report.status,
    "Start Date": formatDate(report.start_date),
    "End Date": formatDate(report.end_date),
    "Date Submitted": formatDate(report.date_submitted),
    "Entries": entryCount,
    Remarks: report.remarks ?? "None",
    "Latest Review": report.latest_review_status
      ? reviewStatusLabels[report.latest_review_status]
      : "No review",
    "Review Remarks": report.latest_review_remarks ?? "None",
    "Review Date": formatDate(report.latest_review_date),
  };
}

export default function ReportReviewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const reportId = Number(params.reportId);
  const validReportId = Number.isFinite(reportId) && reportId > 0 ? reportId : null;
  const detailQuery = useSubmittedReportDetail(validReportId);
  const createReview = useCreateReviewDecision();
  const updateReview = useUpdateReviewDecision();
  const { toast } = useToast();
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [reviewDraft, setReviewDraft] = useState<{
    reportId: number;
    status: ReviewStatus;
    remarks: string;
  } | null>(null);

  const detail = detailQuery.data;
  const report = detail?.report ?? null;
  const entries = useMemo(() => detail?.forms ?? [], [detail?.forms]);
  const activeDraft =
    report && reviewDraft?.reportId === report.report_id ? reviewDraft : null;
  const draftStatus = activeDraft?.status ?? report?.latest_review_status ?? "approved";
  const draftRemarks = activeDraft?.remarks ?? report?.latest_review_remarks ?? "";
  const selectedEntry = useMemo(
    () =>
      entries.find((entry) => entry.entry_id === selectedEntryId) ??
      entries[0] ??
      null,
    [entries, selectedEntryId]
  );

  function updateReviewDraft(next: Partial<{ status: ReviewStatus; remarks: string }>) {
    if (!report) return;

    setReviewDraft({
      reportId: report.report_id,
      status: next.status ?? draftStatus,
      remarks: next.remarks ?? draftRemarks,
    });
  }

  async function handleSubmitReview() {
    if (!report) return;

    const input = {
      reportId: report.report_id,
      status: draftStatus,
      remarks: draftRemarks.trim() || undefined,
    };

    if (report.latest_review_id) {
      try {
        await updateReview.mutateAsync({
          reviewId: report.latest_review_id,
          ...input,
        });
        toast({
          title: "Review updated",
          description: "The review decision was saved.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Unable to update review",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "error",
        });
      }
      return;
    }

    try {
      await createReview.mutateAsync(input);
      toast({
        title: "Report reviewed",
        description: "The review decision was submitted.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Unable to submit review",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "error",
      });
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 bg-[#6b0f1a] px-8 text-xs text-white/80">
          <button onClick={() => navigate("/report-submissions")} className="hover:text-white">
            Report Submissions
          </button>
          <ChevronRight size={12} />
          <span className="text-white">Review</span>
        </div>

        <div className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Report Review</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Inspect report entries and submit the department review decision.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => void detailQuery.refetch()}
              disabled={detailQuery.isFetching}
            >
              <RefreshCw size={14} className={detailQuery.isFetching ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          {detailQuery.isLoading ? (
            <div className="rounded-lg border bg-background px-6 py-12 text-center text-sm text-muted-foreground">
              Loading report review...
            </div>
          ) : detailQuery.isError || !report ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-12 text-center text-sm text-destructive">
              Unable to load this report for review.
            </div>
          ) : (
            <div className="grid min-w-0 gap-6">
              <Card className="rounded-lg">
                <CardHeader className="border-b">
                  <CardTitle>Report Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGrid values={reportSummary(report, entries.length)} />
                </CardContent>
              </Card>

              <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(18rem,22rem)_1fr]">
                <Card className="min-w-0 rounded-lg">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span>Entries List</span>
                      <Badge variant="outline">{entries.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {entries.length === 0 ? (
                      <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
                        No entries are attached to this report.
                      </div>
                    ) : null}

                    {entries.map((entry, index) => {
                      const isSelected = selectedEntry?.entry_id === entry.entry_id;

                      return (
                        <button
                          key={entry.entry_id}
                          type="button"
                          className={`w-full min-w-0 rounded-md border p-3 text-left transition-colors ${
                            isSelected
                              ? "border-[#6b0f1a] bg-[#6b0f1a]/5 ring-1 ring-[#6b0f1a]"
                              : "bg-background hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedEntryId(entry.entry_id)}
                        >
                          <div className="truncate text-sm font-medium">
                            Entry {index + 1}: {entry.title}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{entry.type}</Badge>
                          </div>
                          <p className="mt-2 line-clamp-2 break-words text-xs text-muted-foreground">
                            {getEntryPreview(entry)}
                          </p>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="min-w-0 rounded-lg">
                  <CardHeader className="border-b">
                    <CardTitle className="flex min-w-0 flex-wrap items-center gap-2">
                      {selectedEntry ? selectedEntry.title : "Entry Details"}
                      {selectedEntry ? <Badge variant="outline">{selectedEntry.type}</Badge> : null}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="min-w-0 space-y-5">
                    {selectedEntry ? (
                      selectedEntry.groups.map((group) => (
                        <section key={group.label} className="min-w-0 space-y-2">
                          <h4 className="break-words text-sm font-semibold">{group.label}</h4>
                          <FieldGrid values={group.values} />
                        </section>
                      ))
                    ) : (
                      <div className="rounded-md border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                        Select an entry to view details.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-lg">
                <CardHeader className="border-b">
                  <CardTitle>Submit Review</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[16rem_1fr_auto] lg:items-end">
                  <label className="space-y-1.5 text-sm">
                    <span className="font-medium">Outcome</span>
                    <Select
                      value={draftStatus}
                      onValueChange={(value) => updateReviewDraft({ status: value as ReviewStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="partially_approved">Partially approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="min-w-0 space-y-1.5 text-sm">
                    <span className="font-medium">Remarks / comments</span>
                    <Textarea
                      className="min-h-24 resize-y"
                      value={draftRemarks}
                      onChange={(event) => updateReviewDraft({ remarks: event.target.value })}
                    />
                  </label>

                  <Button
                    className="gap-2 bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                    disabled={createReview.isPending || updateReview.isPending}
                    onClick={() => void handleSubmitReview()}
                  >
                    <CheckCircle2 size={15} />
                    {report.latest_review_id ? "Update Review" : "Submit Review"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
