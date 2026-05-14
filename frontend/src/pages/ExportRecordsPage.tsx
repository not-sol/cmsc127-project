"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import { Download, Info, Lock } from "lucide-react";

type Report = {
  id: number;
  title: string;
  period: string;
  submitted: string;
  status: string;
};

type Entry = {
  id: number;
  reportId: number;
  type: string;
};

const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: "Research Accomplishment Report",
    period: "2025 Q1",
    submitted: "Jan 15, 2025",
    status: "Fully Approved",
  },
  {
    id: 2,
    title: "Extension Services Report",
    period: "2025 Q1",
    submitted: "Jan 18, 2025",
    status: "Pending Chair Approval",
  },
  {
    id: 3,
    title: "Faculty Publications Report",
    period: "2025 Q2",
    submitted: "Apr 05, 2025",
    status: "Fully Approved",
  },
];

const MOCK_ENTRIES: Entry[] = [
  { id: 1, reportId: 1, type: "Research" },
  { id: 2, reportId: 1, type: "Publication" },
  { id: 3, reportId: 1, type: "Publication" },
  { id: 4, reportId: 3, type: "Training" },
];

export default function ExportsRecordsPage() {
  const role: string = "faculty";

  const isChair = role === "department_chair";

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<"isip" | "pbms">(
    "isip"
  );

  const approved = useMemo(
    () =>
      MOCK_REPORTS.filter(
        (report) => report.status === "Fully Approved"
      ),
    []
  );

  const notApproved = useMemo(
    () =>
      MOCK_REPORTS.filter(
        (report) => report.status !== "Fully Approved"
      ),
    []
  );

  const selected = approved.find((report) => report.id === selectedId);

  const entryCount = selected
    ? MOCK_ENTRIES.filter((entry) => entry.reportId === selected.id)
      .length
    : 0;

  const activeFormat = isChair ? exportFormat : "isip";

  const handleExport = () => {
    if (!selected) return;

    console.log(
      `Exporting ${selected.title} as ${activeFormat.toUpperCase()} CSV`
    );
  };

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
              Export Records
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {isChair
                ? "Export approved reports as ISIP or PBMS-formatted CSV."
                : "Export your approved reports as ISIP-formatted CSV."}
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              Only{" "}
              <span className="font-semibold">
                Fully Approved
              </span>{" "}
              reports can be exported.
              {isChair
                ? " Department Chairs may export reports in ISIP or PBMS format."
                : " Contact your Department Chair for PBMS exports."}
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* LEFT PANEL */}
            <div className="rounded-xl border bg-background shadow-sm">
              <div className="border-b bg-muted/40 px-5 py-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select a Report to Export
                </h2>
              </div>

              {/* Approved Reports */}
              {approved.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="font-medium">
                    No fully approved reports yet
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Reports must be approved before export.
                  </p>
                </div>
              ) : (
                approved.map((report) => {
                  const isSelected =
                    selectedId === report.id;

                  const count = MOCK_ENTRIES.filter(
                    (entry) =>
                      entry.reportId === report.id
                  ).length;

                  return (
                    <button
                      key={report.id}
                      onClick={() =>
                        setSelectedId(report.id)
                      }
                      className={`flex w-full items-start gap-4 border-b px-5 py-4 text-left transition hover:bg-muted/40 ${isSelected
                          ? "border-l-4 border-l-[#6b0f1a] bg-red-50"
                          : ""
                        }`}
                    >
                      <div
                        className={`mt-1 h-4 w-4 rounded-full border-2 ${isSelected
                            ? "border-[#6b0f1a] bg-[#6b0f1a]"
                            : "border-muted-foreground"
                          }`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {report.title}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          Period: {report.period} ·{" "}
                          {count} entries
                        </div>
                      </div>

                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        Approved
                      </span>
                    </button>
                  );
                })
              )}

              {/* Locked Reports */}
              {notApproved.length > 0 && (
                <>
                  <div className="flex items-center gap-2 border-y bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Not Eligible for Export
                  </div>

                  {notApproved.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start gap-4 border-b px-5 py-4 opacity-50"
                    >
                      <div className="mt-1 h-4 w-4 rounded-full border-2 border-muted-foreground" />

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {report.title}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          {report.period}
                        </div>
                      </div>

                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                        {report.status}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-4">
              {/* Export Format */}
              {isChair && (
                <div className="rounded-xl border bg-background p-5 shadow-sm">
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Export Format
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "isip",
                        label: "ISIP",
                        desc: "Internal records",
                      },
                      {
                        value: "pbms",
                        label: "PBMS",
                        desc: "System upload",
                      },
                    ].map((format) => {
                      const active =
                        exportFormat === format.value;

                      return (
                        <button
                          key={format.value}
                          onClick={() =>
                            setExportFormat(
                              format.value as
                              | "isip"
                              | "pbms"
                            )
                          }
                          className={`rounded-lg border-2 p-3 text-left transition ${active
                              ? "border-[#6b0f1a] bg-red-50"
                              : "border-border hover:bg-muted/40"
                            }`}
                        >
                          <div className="font-semibold">
                            {format.label}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {format.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Export Card */}
              <div
                className={`rounded-xl border bg-background p-5 shadow-sm ${selected
                    ? "border-[#6b0f1a]"
                    : "border-border"
                  }`}
              >
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Export
                </h3>

                {!selected ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Select a report to continue.
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                      <div className="truncate font-medium">
                        {selected.title}
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {selected.period}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {entryCount} entries
                        </span>

                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 uppercase">
                          {activeFormat}
                        </span>
                      </div>
                    </div>

                    {/* Export Button */}
                    <button
                      onClick={handleExport}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6b0f1a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5a0d16]"
                    >
                      <Download className="h-4 w-4" />
                      Download{" "}
                      {activeFormat.toUpperCase()} CSV
                    </button>

                    <p className="mt-3 truncate text-center text-xs text-muted-foreground">
                      {selected.title
                        .replace(
                          /[^a-z0-9]/gi,
                          "_"
                        )
                        .toLowerCase()}
                      _
                      {activeFormat.toUpperCase()}
                      .csv
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
