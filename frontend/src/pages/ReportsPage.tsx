import { useState } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, Plus, Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";

const sampleReports = [
  {
    id: 1,
    title: "Table cell",
    reportingPeriod: "Table cell",
    dateSubmitted: "Table cell",
    status: "Label",
    totalEntries: 0,
    remarks: "",
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">My Accomplishment Reports</h2>

          {/* Table card */}
          <div className="rounded-lg border p-4 flex flex-col gap-4">

            {/* Toolbar */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <Input
                  className="pl-8 h-8 text-sm"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Filters */}
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm">
                <Filter size={13} />
                Filters
              </Button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Add New Report */}
              <Button size="sm" className="h-8 gap-1.5 text-sm bg-foreground text-background hover:bg-foreground/90">
                <Plus size={13} />
                Add New Report
              </Button>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Report Title</TableHead>
                  <TableHead className="text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      Reporting Period
                      <ArrowUpDown size={12} className="text-muted-foreground" />
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold">Date Submitted</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-xs font-semibold">Total Entries</TableHead>
                  <TableHead className="text-xs font-semibold">Remarks</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-sm">{report.title}</TableCell>
                    <TableCell className="text-sm">{report.reportingPeriod}</TableCell>
                    <TableCell className="text-sm">{report.dateSubmitted}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{report.totalEntries}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.remarks}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" className="h-7 px-3 text-xs bg-foreground text-background hover:bg-foreground/90">
                          View
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Eye size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Footer: count + pagination */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Showing 1-10 of 100 reports</span>
              <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-0.5">
                  <PaginationItem>
                    <PaginationPrevious href="#" className="h-7 px-2 text-xs" />
                  </PaginationItem>
                  {[1, 2, 3, 4].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink href="#" isActive={page === 1} className="h-7 w-7 text-xs">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationEllipsis className="h-7 w-7" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="h-7 w-7 text-xs">10</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="h-7 px-2 text-xs" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
