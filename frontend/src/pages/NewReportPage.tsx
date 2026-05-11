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
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ENTRY_TYPES } from "@/lib/constants";

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <a
        href="/reports"
        className="hover:text-white transition-colors"
      >
        My Reports
      </a>

      <ChevronRight size={12} />

      <span className="text-white">Create/Edit Report</span>
    </div>
  );
}

type Entry = {
  id: number;
  title: string;
  period: string;
  date: string;
  status: string;
  remarks?: string;
};

export default function NewEntryPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [search, setSearch] = useState("");

  const [entries] = useState<Entry[]>([]);

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
    if (!search) return entries;

    return entries.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [entries, search]);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a] flex items-center px-8">
          <Breadcrumb />
        </div>

        <div className="flex-1 px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">
                Create/Edit Report
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Manage accomplishment entries and report details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Save as Draft
              </Button>

              <Button
                size="sm"
                className="bg-[#6b0f1a] hover:bg-[#5a0a0a]"
              >
                Submit Report
              </Button>
            </div>
          </div>

          {/* Report metadata */}
          <div className="flex gap-6 mb-8">
            {/* Left */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <Label>Accomplishment Report Title</Label>

                <Input
                  placeholder="Enter report title here"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Start Date</Label>

                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>End Date</Label>

                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-1.5 w-80">
              <Label>Remarks</Label>

              <Textarea
                placeholder="Type remarks here."
                className="resize-none h-24"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          {/* Section title */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              List of Accomplishments
            </h3>

            <div className="mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#6b0f1a] hover:bg-[#5a0a0a]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Entry
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-72">
                {ENTRY_TYPES.map((et) => (
                  <DropdownMenuItem
                    key={et.id}
                    onClick={() => {
                      navigate(routeMap[et.id]);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {et.letter}.
                      </span>
                      <span>{et.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {et.pbms}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search entries..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Entries Table */}
          <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="w-32">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No entries yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.title}
                      </TableCell>

                      <TableCell>
                        {entry.period}
                      </TableCell>

                      <TableCell>
                        {entry.date}
                      </TableCell>

                      <TableCell>
                        {entry.status}
                      </TableCell>

                      <TableCell>
                        {entry.remarks || "—"}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
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
          </div>
        </div>
      </main>
    </div>
  );
}