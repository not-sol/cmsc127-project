import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Calendar as CalendarIcon,
  Filter,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ENTRY_TYPES } from "@/lib/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteReportEntry,
  fetchReportEntryDetails,
  fetchReportEntries,
  type ReportEntry,
} from "@/api/entries";
import {
  createDraftReport,
  getAccessibleReports,
  updateReportMetadata,
  updateReportStatus,
} from "@/api/reports";
import { useAuth } from "@/hooks/use-auth";
import { getEntryFormPath, getReportEditorPath } from "@/features/forms/report-navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <a href="/reports" className="hover:text-white transition-colors">
        My Reports
      </a>
      <ChevronRight size={12} />
      <span className="text-white">Create/Edit Report</span>
    </div>
  );
}

export default function NewReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const reportIdParam = Number(searchParams.get("reportId"));
  const reportId = Number.isFinite(reportIdParam) && reportIdParam > 0 ? reportIdParam : null;
  const mode = searchParams.get("mode");
  const {
    data: entries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["report-entries", reportId],
    queryFn: () => fetchReportEntries(reportId),
    enabled: reportId !== null,
  });
  const reportQuery = useQuery({
    queryKey: ["reports", "editor", reportId],
    queryFn: getAccessibleReports,
    enabled: reportId !== null,
  });
  const deleteEntry = useMutation({
    mutationFn: deleteReportEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["report-entries", reportId] });
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  const saveDraft = useMutation({
    mutationFn: async () => {
      const payload = getMetadataPayload();

      if (reportId) {
        return updateReportMetadata(reportId, payload);
      }

      return createDraftReport(payload);
    },
    onSuccess: (report) => {
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
      void queryClient.invalidateQueries({ queryKey: ["reports", "editor", report.report_id] });
      if (!reportId) navigate(getReportEditorPath(report.report_id), { replace: true });
    },
  });
  const submitReport = useMutation({
    mutationFn: async () => {
      const payload = getMetadataPayload();
      const targetReport = reportId
        ? await updateReportMetadata(reportId, payload)
        : await createDraftReport(payload);

      return updateReportStatus(targetReport.report_id, "pending", payload);
    },
    onSuccess: (report) => {
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
      void queryClient.invalidateQueries({ queryKey: ["submitted-reports"] });
      navigate(getReportEditorPath(report.report_id), { replace: true });
    },
  });
  const entryDetails = useMutation({
    mutationFn: fetchReportEntryDetails,
  });

  const [title, setTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [viewEntry, setViewEntry] = useState<ReportEntry | null>(null);
  const currentReport = useMemo(
    () => (reportId ? reportQuery.data?.find((report) => report.report_id === reportId) ?? null : null),
    [reportId, reportQuery.data]
  );
  const reportStatus = currentReport?.status ?? "draft";
  const isReadOnly = mode === "view" || reportStatus !== "draft";

  const routeMap: Record<string, string> = {
    pub: "/form-a",
    res: "/form-b",
    pres: "/form-c",
    patent: "/form-d",
    creative: "/form-e",
    award: "/form-f",
    train: "/form-g",
    ext: "/form-h",
    partner: "/form-i",
    auth: "/form-j",
    other: "/form-k",
  };

  const filteredEntries = useMemo(() => {
    let result = entries;

    // 1. Search Filter
    if (search) {
      const normalizedSearch = search.toLowerCase();
      result = result.filter((entry) =>
        [entry.section, entry.title, entry.date, entry.remarks]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))
      );
    }

    // 2. Section Filter
    if (selectedSections.length > 0) {
      result = result.filter((entry) => selectedSections.includes(entry.section));
    }

    // 3. Date Range Filter
    if (filterStartDate || filterEndDate) {
      result = result.filter((entry) => {
        if (!entry.dateValue) return false;
        const entryTime = new Date(entry.dateValue).getTime();

        if (filterStartDate) {
          const start = filterStartDate.getTime();
          if (entryTime < start) return false;
        }

        if (filterEndDate) {
          const end = filterEndDate.getTime();
          if (entryTime > end) return false;
        }

        return true;
      });
    }

    return result;
  }, [entries, search, selectedSections, filterStartDate, filterEndDate]);

  useEffect(() => {
    if (!currentReport) return;

    setStartDate(currentReport.start_date ? new Date(`${currentReport.start_date}T00:00:00`) : undefined);
    setEndDate(currentReport.end_date ? new Date(`${currentReport.end_date}T00:00:00`) : undefined);
    setRemarks(currentReport.remarks ?? "");
  }, [currentReport]);

  function toIsoDate(value?: Date) {
    if (!value) return null;

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getMetadataPayload() {
    return {
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      remarks: remarks.trim() || null,
      departmentId: profile?.department_id ?? null,
    };
  }

  const ensureDraftReport = async () => {
    if (reportId) return reportId;

    const report = await saveDraft.mutateAsync();
    return report.report_id;
  };

  const handleCreateEntry = async (route: string) => {
    const targetReportId = await ensureDraftReport();
    navigate(getEntryFormPath(route, targetReportId));
  };

  const handleView = async (entry: ReportEntry) => {
    setViewEntry(entry);
    await entryDetails.mutateAsync(entry.id);
  };

  const handleEdit = (entry: ReportEntry) => {
    if (!entry.formRoute || isReadOnly) return;
    navigate(getEntryFormPath(entry.formRoute, reportId ?? undefined, entry.id));
  };

  const handleDelete = async (entry: ReportEntry) => {
    if (!window.confirm(`Delete "${entry.title}" from the database?`)) return;
    await deleteEntry.mutateAsync(entry.id);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#6b0f1a] flex items-center px-8">
          <Breadcrumb />
        </div>

        <div className="flex-1 px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Create/Edit Report</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage accomplishment entries and report details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void saveDraft.mutateAsync()}
                disabled={isReadOnly || saveDraft.isPending || submitReport.isPending}
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                className="bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                onClick={() => void submitReport.mutateAsync()}
                disabled={isReadOnly || submitReport.isPending || saveDraft.isPending}
              >
                Submit Report
              </Button>
            </div>
          </div>

          <div className="flex gap-6 mb-8">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <Label>Accomplishment Report Title</Label>
                <Input
                  className="bg-[#f5f5f5]"
                  placeholder="Enter report title here"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal bg-[#f5f5f5]",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={isReadOnly}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-1.5 ">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] justify-start text-left font-normal bg-[#f5f5f5]",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={isReadOnly}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-80">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Type remarks here."
                className="resize-none h-24 bg-[#f5f5f5]"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="rounded-lg border p-4 flex flex-col gap-4 bg-[#f5f5f5]">
            {/* Toolbar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-8 h-8 text-sm"
                  placeholder="Search entries..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              {/* Filters */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm">
                    <Filter size={13} />
                    Filters
                    {(selectedSections.length > 0 || filterStartDate || filterEndDate) && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#6b0f1a] text-white text-[10px] font-bold">
                        {selectedSections.length + (filterStartDate ? 1 : 0) + (filterEndDate ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Filters</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setSelectedSections([]);
                          setFilterStartDate(undefined);
                          setFilterEndDate(undefined);
                        }}
                      >
                        Clear all
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">Sections</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {ENTRY_TYPES.map((type) => (
                          <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`filter-${type.id}`} 
                              checked={selectedSections.includes(type.label)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSections([...selectedSections, type.label]);
                                } else {
                                  setSelectedSections(selectedSections.filter(s => s !== type.label));
                                }
                              }}
                            />
                            <label 
                              htmlFor={`filter-${type.id}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {type.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold">Accomplishment Period</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="filter-start" className="text-[10px]">From</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="filter-start"
                                variant="outline"
                                className={cn(
                                  "w-full h-8 justify-start text-left font-normal text-xs",
                                  !filterStartDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {filterStartDate ? format(filterStartDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={filterStartDate}
                                onSelect={setFilterStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="filter-end" className="text-[10px]">To</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="filter-end"
                                variant="outline"
                                className={cn(
                                  "w-full h-8 justify-start text-left font-normal text-xs",
                                  !filterEndDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {filterEndDate ? format(filterEndDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={filterEndDate}
                                onSelect={setFilterEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="flex-1" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 text-sm bg-[#6b0f1a] hover:bg-[#5a0a0a]"
                    disabled={isReadOnly || saveDraft.isPending}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Entry
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-72">
                  {ENTRY_TYPES.map((entryType) => (
                    <DropdownMenuItem
                      key={entryType.id}
                      onClick={() => void handleCreateEntry(routeMap[entryType.id])}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{entryType.letter}.</span>
                        <span>{entryType.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Section</TableHead>
                  <TableHead className="text-xs font-semibold">Title</TableHead>
                  <TableHead className="text-xs font-semibold">Accomplishment Period</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                      Loading entries...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-destructive text-sm">
                      {error instanceof Error ? error.message : "Failed to load entries."}
                    </TableCell>
                  </TableRow>
                ) : filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                      No entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm">{entry.section}</TableCell>
                      <TableCell className="text-sm font-medium">{entry.title}</TableCell>
                      <TableCell className="text-sm">{entry.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="h-7 px-3 text-xs bg-foreground text-background hover:bg-foreground/90"
                            onClick={() => handleView(entry)}
                          >
                            View
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(entry)}
                            disabled={!entry.formRoute || isReadOnly}
                            title="Edit entry"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(entry)}
                            disabled={deleteEntry.isPending || isReadOnly}
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Footer: count */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">
                Total entries: {filteredEntries.length}
              </span>
            </div>
          </div>
        </div>
      </main>

      {viewEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{viewEntry.section}</p>
                <h3 className="text-xl font-bold">{viewEntry.title}</h3>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewEntry(null)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              {entryDetails.isPending ? (
                <p className="text-sm text-muted-foreground">Loading details...</p>
              ) : entryDetails.isError ? (
                <p className="text-sm text-destructive">
                  {entryDetails.error instanceof Error
                    ? entryDetails.error.message
                    : "Failed to load details."}
                </p>
              ) : (
                (entryDetails.data ?? []).map((group) => (
                  <section key={group.label} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <h4 className="font-semibold">{group.label}</h4>
                    <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {Object.entries(group.values).map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                          <dd className="break-words text-sm">{String(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
