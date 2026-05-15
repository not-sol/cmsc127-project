"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Filter,
  Trash2,
  ArrowUpDown,
  Eye,
} from "lucide-react";

type Submission = {
  id: number;
  author: string;
  dept: string;
  title: string;
  period: string;
  submitted: string;
  entries: number;
  status:
    | "Waiting for Approval"
    | "Partially Approved"
    | "Fully Approved";
  comments: string;
};

const sampleSubmissions: Submission[] = [
  {
    id: 1,
    author: "Juan Dela Cruz",
    dept: "DMPCS",
    title: "Faculty Accomplishment Report",
    period: "04/01/2026 - 05/07/2026",
    submitted: "05/10/2026",
    entries: 12,
    status: "Waiting for Approval",
    comments: "",
  },
  {
    id: 2,
    author: "Maria Santos",
    dept: "DMPCS",
    title: "Research and Extension Report",
    period: "04/11/2026 - 05/09/2026",
    submitted: "05/12/2026",
    entries: 8,
    status: "Partially Approved",
    comments:
      "Please revise supporting documents.",
  },
];

export default function ReportSubmissionPage() {
  const [submissions, setSubmissions] =
    useState<Submission[]>(sampleSubmissions);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] =
    useState("all");

  const [selectedReport, setSelectedReport] =
    useState<Submission | null>(null);

  const [reviewStatus, setReviewStatus] =
    useState<Submission["status"]>(
      "Waiting for Approval"
    );

  const [reviewComments, setReviewComments] =
    useState("");

  const filteredSubmissions = submissions.filter(
    (s) => {
      const matchSearch =
        !search ||
        s.author
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        s.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "all" ||
        s.status === filterStatus;

      return matchSearch && matchStatus;
    }
  );

  const total = submissions.length;

  const waiting = submissions.filter(
    (s) => s.status === "Waiting for Approval"
  ).length;

  const approved = submissions.filter(
    (s) => s.status === "Fully Approved"
  ).length;

  const partial = submissions.filter(
    (s) => s.status === "Partially Approved"
  ).length;

  function openReview(report: Submission) {
    setSelectedReport(report);
    setReviewStatus(report.status);
    setReviewComments(report.comments);
  }

  function saveReview() {
    if (!selectedReport) return;

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedReport.id
          ? {
              ...s,
              status: reviewStatus,
              comments: reviewComments,
            }
          : s
      )
    );

    setSelectedReport(null);
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 min-w-0 flex flex-col">

        {/* Top Bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Report Submissions
            </h1>

            <p className="text-muted-foreground mt-1">
              Review and manage faculty report
              submissions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

            <div
              className="rounded-lg border bg-background p-4 cursor-pointer"
              onClick={() =>
                setFilterStatus("all")
              }
            >
              <p className="text-sm text-muted-foreground">
                Total
              </p>

              <h2 className="text-2xl font-bold">
                {total}
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                All submissions
              </p>
            </div>

            <div
              className="rounded-lg border bg-background p-4 cursor-pointer"
              onClick={() =>
                setFilterStatus(
                  "Waiting for Approval"
                )
              }
            >
              <p className="text-sm text-muted-foreground">
                Pending Review
              </p>

              <h2 className="text-2xl font-bold">
                {waiting}
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                Needs action
              </p>
            </div>

            <div
              className="rounded-lg border bg-background p-4 cursor-pointer"
              onClick={() =>
                setFilterStatus(
                  "Partially Approved"
                )
              }
            >
              <p className="text-sm text-muted-foreground">
                Partially Approved
              </p>

              <h2 className="text-2xl font-bold">
                {partial}
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                Requires revisions
              </p>
            </div>

            <div
              className="rounded-lg border bg-background p-4 cursor-pointer"
              onClick={() =>
                setFilterStatus(
                  "Fully Approved"
                )
              }
            >
              <p className="text-sm text-muted-foreground">
                Fully Approved
              </p>

              <h2 className="text-2xl font-bold">
                {approved}
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                Ready for export
              </p>
            </div>

          </div>

          {/* Table Card */}
          <div className="rounded-lg border p-4 flex flex-col gap-4 bg-background">

            {/* Toolbar */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />

                  <path d="m21 21-4.35-4.35" />
                </svg>

                <Input
                  className="pl-8 h-8 text-sm"
                  placeholder="Search by author or report title"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-sm"
              >
                <Filter size={13} />
                Filters
              </Button>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
                className="h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="Waiting for Approval">
                  Waiting for Approval
                </option>

                <option value="Partially Approved">
                  Partially Approved
                </option>

                <option value="Fully Approved">
                  Fully Approved
                </option>
              </select>

              <div className="flex-1" />
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>

                  <TableHead className="text-xs font-semibold">
                    Author
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      Report Title
                      <ArrowUpDown
                        size={12}
                        className="text-muted-foreground"
                      />
                    </span>
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Reporting Period
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Submitted
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Entries
                  </TableHead>

                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>

                  <TableHead className="text-xs font-semibold text-right">
                    Actions
                  </TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>

                {filteredSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10"
                    >
                      <div>
                        <p className="font-medium">
                          No reports found
                        </p>

                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your
                          search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {filteredSubmissions.map((r) => {
                  const initials =
                    r.author
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase();

                  return (
                    <TableRow key={r.id}>

                      {/* Author */}
                      <TableCell>
                        <div className="flex items-center gap-3">

                          <div className="w-8 h-8 rounded-full bg-[#6b0f1a] text-white flex items-center justify-center text-xs font-medium">
                            {initials}
                          </div>

                          <div>
                            <p className="text-sm font-medium">
                              {r.author}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {r.dept}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="text-sm max-w-[250px] truncate">
                        {r.title}
                      </TableCell>

                      {/* Period */}
                      <TableCell className="text-sm">
                        {r.period}
                      </TableCell>

                      {/* Submitted */}
                      <TableCell className="text-sm">
                        {r.submitted}
                      </TableCell>

                      {/* Entries */}
                      <TableCell className="text-sm">
                        {r.entries}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            r.status ===
                            "Fully Approved"
                              ? "bg-green-100 text-green-700"
                              : r.status ===
                                "Partially Approved"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">

                          {/* Review Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() =>
                              openReview(r)
                            }
                          >
                            <Eye size={12} />
                            Review
                          </Button>

                        </div>
                      </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Showing{" "}
                {filteredSubmissions.length} reports
              </span>

              <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-0.5">

                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className="h-7 px-2 text-xs"
                    />
                  </PaginationItem>

                  {[1, 2, 3].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === 1}
                        className="h-7 w-7 text-xs"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationEllipsis className="h-7 w-7" />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className="h-7 px-2 text-xs"
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>

        {/* Review Modal */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-background rounded-lg border w-full max-w-lg p-6 space-y-5">

              {/* Header */}
              <div>
                <h2 className="text-xl font-semibold">
                  Review Report
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Review submission and provide
                  feedback
                </p>
              </div>

              {/* Report Details */}
              <div className="space-y-2 text-sm">

                <div>
                  <span className="font-medium">
                    Author:
                  </span>{" "}
                  {selectedReport.author}
                </div>

                <div>
                  <span className="font-medium">
                    Title:
                  </span>{" "}
                  {selectedReport.title}
                </div>

                <div>
                  <span className="font-medium">
                    Reporting Period:
                  </span>{" "}
                  {selectedReport.period}
                </div>

                <div>
                  <span className="font-medium">
                    Entries:
                  </span>{" "}
                  {selectedReport.entries}
                </div>

              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Approval Status
                </label>

                <select
                  value={reviewStatus}
                  onChange={(e) =>
                    setReviewStatus(
                      e.target
                        .value as Submission["status"]
                    )
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Waiting for Approval">
                    Waiting for Approval
                  </option>

                  <option value="Partially Approved">
                    Partially Approved
                  </option>

                  <option value="Fully Approved">
                    Fully Approved
                  </option>
                </select>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comments
                </label>

                <Textarea
                  placeholder="Add review comments or feedback..."
                  value={reviewComments}
                  onChange={(e) =>
                    setReviewComments(
                      e.target.value
                    )
                  }
                  className="min-h-[120px]"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">

                <Button
                  variant="outline"
                  onClick={() =>
                    setSelectedReport(null)
                  }
                >
                  Cancel
                </Button>

                <Button onClick={saveReview}>
                  Save Review
                </Button>

              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
