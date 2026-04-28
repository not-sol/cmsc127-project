import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <a href="/reports" className="hover:text-white transition-colors">My Reports</a>
      <ChevronRight size={12} />
      <a href="/reports/new" className="hover:text-white transition-colors">Create/Edit Report</a>
      <ChevronRight size={12} />
      <span className="text-white">New Entry</span>
    </div>
  );
}

export default function NewEntryPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar with breadcrumb */}
        <div className="h-12 bg-[#6b0f1a] flex items-center px-8">
          <Breadcrumb />
        </div>

        <div className="flex-1 px-8 py-8">
          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">New Entry</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Discard</Button>
              <Button variant="outline" size="sm">Save as Draft</Button>
              <Button
                size="sm"
                className="bg-[#6b0f1a] hover:bg-[#5a0a0a] text-white"
              >
                Save Entry
              </Button>
            </div>
          </div>

          {/* Form fields */}
          <div className="flex gap-6 mb-8">
            {/* Left: Title + dates */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium">Title</Label>
                <Input placeholder="Enter report title here" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium shrink-0">Start Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="pl-8 w-36 text-sm text-muted-foreground"
                      placeholder="Pick a date"
                    />
                    <svg
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium shrink-0">End Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="pl-8 w-36 text-sm text-muted-foreground"
                      placeholder="Pick a date"
                    />
                    <svg
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Remarks */}
            <div className="flex flex-col gap-1.5 w-80">
              <Label className="text-sm font-medium">Remarks</Label>
              <Textarea
                placeholder="Type remarks here."
                className="resize-none h-24"
              />
            </div>
          </div>

          {/* List of Accomplishments */}
          <h3 className="text-lg font-bold">List of Accomplishments</h3>
        </div>
      </main>
    </div>
  );
}
