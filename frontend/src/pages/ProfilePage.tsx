import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { getAccessibleReports, type ReportSummary } from "@/api/reports";

function formatDate(value?: string | null) {
  if (!value) return "Not submitted";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getReportTitle(report: ReportSummary) {
  if (report.remarks?.trim()) {
    return report.remarks.split(".")[0];
  }
  return `Report #${report.report_id}`;
}

function getReportingPeriod(report: ReportSummary) {
  if (!report.start_date && !report.end_date) return "No period set";
  return `${formatDate(report.start_date)} - ${formatDate(report.end_date)}`;
}

export default function ProfilePage() {
  const { profile, isLoading: isAuthLoading } = useAuth();

  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: () => getAccessibleReports(),
    enabled: !!profile,
  });

  const isLoading = isAuthLoading || reportsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  const fullName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
      profile.email ||
      "User"
    : "Not logged in";

  const departmentName = profile?.department?.department_name ?? "Not assigned";
  const collegeName = profile?.department?.college_name ?? "Not assigned";

  const position =
    profile?.role === "admin"
      ? "Administrator"
      : profile?.role === "department_chair"
      ? "Department Chair"
      : profile?.employment_type ?? "Faculty";

  const reports = reportsQuery.data ?? [];
  const totalReports = reports.length;
  const approvedReports = reports.filter((r) => r.status === "reviewed").length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const draftReports = reports.filter((r) => r.status === "draft").length;

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

          {/* Top row: profile card + accomplishment summary */}
          <div className="flex flex-col lg:flex-row gap-6 mb-4">
            {/* Profile card */}
            <Card className="w-full lg:w-80 shrink-0">
              <CardContent className="flex flex-col items-center text-center px-8 py-8 gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border border-muted bg-muted flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                  {fullName.charAt(0)}
                </div>

                {/* Name & dept */}
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-base">{fullName}</p>
                  <p className="text-muted-foreground text-xs leading-snug p-1">
                    {collegeName}
                    <br /> <br />
                    {departmentName}
                  </p>
                </div>

                <Separator />

                {/* Details */}
                <div className="w-full flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Position</span>
                    <span className="text-muted-foreground">{position}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Email</span>
                    <span className="text-muted-foreground">
                      {profile?.email}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Accomplishment Summary */}
              <Card className="w-full h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Accomplishment Summary
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Overview of submitted accomplishment reports
                      </p>
                    </div>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      ["Total Reports", totalReports],
                      ["Approved", approvedReports],
                      ["Pending", pendingReports],
                      ["Draft", draftReports],
                    ].map(([label, value]) => (
                      <div
                        key={label as string}
                        className="rounded-xl border bg-muted/20 p-4 text-center"
                      >
                        <div className="text-2xl font-bold">
                          {value}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Report History Table */}
                  <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr className="border-b">
                          <th className="text-left px-4 py-3 font-medium">
                            Report Title
                          </th>

                          <th className="text-left px-4 py-3 font-medium">
                            Period
                          </th>

                          <th className="text-left px-4 py-3 font-medium">
                            Status
                          </th>

                          <th className="text-left px-4 py-3 font-medium">
                            Entries
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {reports.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-8 text-center text-muted-foreground"
                            >
                              No reports found.
                            </td>
                          </tr>
                        ) : (
                          reports.slice(0, 5).map((report) => (
                            <tr
                              key={report.report_id}
                              className="border-b last:border-0"
                            >
                              <td className="px-4 py-4 font-medium">
                                {getReportTitle(report)}
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {getReportingPeriod(report)}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                                    ${
                                      report.status === "reviewed"
                                        ? "bg-green-100 text-green-700"
                                        : report.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                  {report.status?.charAt(0).toUpperCase() +
                                    (report.status?.slice(1) ?? "")}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {report.entry_count}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
