import React from "react";
import { useAccomplishments } from "@/hooks/use-accomplishments";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AccomplishmentList: React.FC = () => {
  const { accomplishments, isLoading, isError, error } = useAccomplishments();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-muted-foreground animate-pulse">Loading accomplishments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error: {(error as Error).message}</p>
      </div>
    );
  }

  if (accomplishments.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No accomplishments found. Add your first one above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold px-1">Your Accomplishments ({accomplishments.length})</h2>
      {accomplishments.map((item) => (
        <Card key={item.entry_id} className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 py-3">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg">{item.activity_title}</CardTitle>
              <Badge variant="secondary">
                {item.start_date}
                {item.end_date ? ` to ${item.end_date}` : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="py-4 space-y-2">
            {item.venue && (
              <p className="text-sm">
                <span className="font-semibold">Venue:</span> {item.venue}
              </p>
            )}
            {item.participation && (
              <p className="text-sm">
                <span className="font-semibold">Participation:</span> {item.participation}
              </p>
            )}
            {item.remarks && (
              <div className="mt-2 pt-2 border-t text-sm text-slate-600 italic">
                {item.remarks}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
