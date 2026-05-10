import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

          {/* Top row: profile card + 2 placeholder cards */}
          <div className="flex gap-4 mb-4">
            {/* Profile card */}
            <Card className="w-80 shrink-0">
              <CardContent className="flex flex-col items-center text-center px-8 py-8 gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border border-muted bg-muted" />

                {/* Name & dept */}
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-base">Juan Dela Cruz</p>
                  <p className="text-muted-foreground text-xs leading-snug p-1">
                    College of Science and Mathematics
                    <br /> <br />
                    Department of Mathematics, Physics and
                    <br />
                    Computer Science
                  </p>
                </div>

                <Separator />

                {/* Details */}
                <div className="w-full flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Position</span>
                    <span className="text-muted-foreground">Full Time Faculty</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold">Email</span>
                    <span className="text-muted-foreground">jdcruz@up.edu.ph</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Right content */}
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Accomplishment Summary */}
                <Card className="w-full">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                      {[
                        ["Total Reports", 12],
                        ["Approved", 8],
                        ["Pending", 3],
                        ["Draft", 2],
                      ].map(([label, value]) => (
                        <div
                          key={label}
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
                          {[
                            {
                              title: "1st Semester Accomplishment Report",
                              period: "2025 - 2026",
                              status: "Approved",
                              entries: 18,
                            },
                            {
                              title: "Midyear Accomplishment Report",
                              period: "2025",
                              status: "Pending",
                              entries: 10,
                            },
                            {
                              title: "2nd Semester Accomplishment Report",
                              period: "2024 - 2025",
                              status: "Approved",
                              entries: 26,
                            },
                          ].map((report, index) => (
                            <tr
                              key={index}
                              className="border-b last:border-0"
                            >
                              <td className="px-4 py-4 font-medium">
                                {report.title}
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {report.period}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                                    ${
                                      report.status === "Approved"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                  {report.status}
                                </span>
                              </td>

                              <td className="px-4 py-4 text-muted-foreground">
                                {report.entries}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
