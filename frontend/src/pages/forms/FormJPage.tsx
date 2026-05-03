import Sidebar from "@/components/sidebar"
import FormJAuthorship from "@/features/forms/form-j/form-j"
import { ChevronRight } from "lucide-react"

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-white/80">
      <a href="/report" className="hover:text-white transition-colors">
        My Reports
      </a>
      <ChevronRight size={12} />
      <span className="text-white">
        Form J: Authorships (Audio-Visual Materials / Learning Objects / Manuals)
      </span>
    </div>
  )
}

export default function FormJAuthorshipPage() {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[#6b0f1a] flex items-center px-8">
          <Breadcrumb />
        </div>

        <div className="flex-1 px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">
            Form J: Authorships (Audio-Visual Materials / Learning Objects / Manuals)
          </h2>
          <FormJAuthorship />
        </div>
      </main>
    </div>
  )
}
