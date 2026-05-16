import Sidebar from "@/components/sidebar"
import FormG from "@/features/forms/form-g/form-g"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <a href="/reports" className="hover:text-white transition-colors">
        My Reports
      </a>
      <ChevronRight size={12} />

      <a href="/reports/create-report" className="hover:text-white transition-colors">
        Create/Edit Report
      </a>
      <ChevronRight size={12} />
      <span className="text-white">Form G: Training / Workshop / Seminar Conducted</span>
    </div>
  )
}

export default function FormGPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#6b0f1a] flex items-center px-8">
          <Breadcrumb />
        </div>

        <div className="flex-1 px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              size="sm"
              onClick={() => navigate("/reports/create-report")}
              className="gap-2 hover:bg-[#5a0a0a]"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <h2 className="text-2xl font-bold">
              Form G: Training / Workshop / Seminar Conducted
            </h2>
          </div>
          <FormG />
        </div>
      </main>
    </div>
  )
}
