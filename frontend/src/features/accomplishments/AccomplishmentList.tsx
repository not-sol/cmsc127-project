import React from "react";
import { useAccomplishments } from "@/hooks/use-accomplishments";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText, Clock } from "lucide-react";
import { type Accomplishment } from "@/api/accomplishments";

interface AccomplishmentListProps {
  onEdit: (accomplishment: Accomplishment) => void;
}

export const AccomplishmentList: React.FC<AccomplishmentListProps> = ({ onEdit }) => {
  const { accomplishments, isLoading, isError, error, deleteAccomplishment, isDeleting } = useAccomplishments();

  const handleDelete = async (entryId: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteAccomplishment(entryId);
        alert("Accomplishment deleted successfully.");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6b0f1a]"></div>
        <p className="text-muted-foreground animate-pulse">Loading accomplishments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <p className="font-medium text-sm">Error: {(error as Error).message}</p>
      </div>
    );
  }

  if (accomplishments.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="py-20 text-center flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-muted-foreground">No accomplishments found</p>
            <p className="text-sm text-muted-foreground">Add your first professional achievement above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold text-slate-800">Your Accomplishments</h2>
        <Badge variant="secondary" className="px-3 py-1 bg-[#6b0f1a]/10 text-[#6b0f1a] border-[#6b0f1a]/20">
          {accomplishments.length} Total
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accomplishments.map((item) => (
          <Card key={item.entry_id} className="overflow-hidden group hover:border-[#6b0f1a]/40 transition-all duration-200 shadow-sm hover:shadow-md">
            <CardHeader className="bg-slate-50/50 py-4 border-b">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl font-bold text-slate-900 leading-tight">
                      {item.activity_title}
                    </CardTitle>
                    {item.status === 'draft' && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                    {item.start_date}
                    {item.end_date ? ` — ${item.end_date}` : ""}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-9 w-9 text-slate-600 hover:text-[#6b0f1a] hover:bg-[#6b0f1a]/10"
                    title="Edit accomplishment"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.entry_id, item.activity_title)}
                    disabled={isDeleting}
                    className="h-9 w-9 text-slate-600 hover:text-red-600 hover:bg-red-50"
                    title="Delete accomplishment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {item.venue && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Venue</span>
                    <p className="text-sm font-medium text-slate-700">{item.venue}</p>
                  </div>
                )}
                {item.participation && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Participation</span>
                    <p className="text-sm font-medium text-slate-700">{item.participation}</p>
                  </div>
                )}
              </div>
              
              {item.remarks && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Remarks</span>
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-md p-3 italic border-l-2 border-[#6b0f1a]/20">
                    {item.remarks}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
