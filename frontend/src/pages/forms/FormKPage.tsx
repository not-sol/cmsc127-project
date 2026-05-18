import Sidebar from "@/components/sidebar"
import FormKOther from "@/features/forms/form-k/form-k"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <Link to="/reports" className="hover:text-white transition-colors">
        My Reports
      </Link>
      <ChevronRight size={12} />

      <Link to="/reports/create-report" className="hover:text-white transition-colors">
        Create/Edit Report
      </Link>
      <ChevronRight size={12} />
      <span className="text-white">Form K: Other Accomplishment</span>
    </div>
  )
}

export default function FormKOtherPage() {
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
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-[#5a0a0a]"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <h2 className="text-2xl font-bold">Form K: Other Accomplishment</h2>
          </div>
          <FormKOther />
        </div>
      </main>
    </div>
  )
}
