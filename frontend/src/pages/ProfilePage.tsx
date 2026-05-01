import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function PlaceholderCard({ className = "" }) {
  return (
    <Card className={className}>
      <CardContent className="p-0 h-full" />
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-12 bg-[#6b0f1a]" />

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>

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
                  <p className="text-muted-foreground text-xs leading-snug">
                    College of Science and Mathematics
                    <br />
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

            {/* Right column: 2 small cards stacked, then 1 wide card */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Two small cards side by side */}
              <div className="flex gap-4">
                <PlaceholderCard className="flex-1 h-36" />
                <PlaceholderCard className="flex-1 h-36" />
              </div>
              {/* One card below spanning full width of right column */}
              <PlaceholderCard className="w-full h-36" />
            </div>
          </div>

          {/* Bottom wide card spanning full width */}
          <PlaceholderCard className="w-full h-52" />
        </div>
      </main>
    </div>
  );
}
