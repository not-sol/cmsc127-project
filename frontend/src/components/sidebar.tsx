import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Plus, Download, User, LogOut, LayoutList } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { icon: LayoutGrid, label: "My Reports", href: "/reports" },
  { icon: Plus, label: "Create New Report", href: "/reports/create-report" },
  { icon: LayoutGrid, label: "Faculty Accomplishments", href: "/accomplishments" },
  { icon: Download, label: "Export Records", href: "/exports" },
  { icon: LayoutList, label: "Report Submissions", href: "/report-submissions" },
  { icon: User, label: "User Management", href: "/user-management" },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout, isAdmin, isChair } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/user-management") return isAdmin;
    if (item.href === "/report-submissions") return isAdmin || isChair;
    return true;
  });

  return (
    <aside
      className="sticky top-0 h-screen w-64 shrink-0 flex flex-col px-4 py-6 overflow-y-auto"
      style={{
        backgroundImage: "linear-gradient(to left, #430409 0%, rgba(107,15,26,0.85) 90%, rgba(107,15,26,0.2) 100%)",
        backgroundColor: "#6b0f1a",
      }}
    >
      
      <div
        className="absolute inset-0 -translate-y-2 pointer-events-none"
        style={{
          mixBlendMode: "soft-light",
          backgroundColor: "white",
          maskImage: "url('/pattern.png')",
          maskRepeat: "repeat",
          maskSize: "900px",
          WebkitMaskImage: "url('/pattern.png')",
          WebkitMaskRepeat: "repeat",
          WebkitMaskSize: "900px",
          opacity: 0.2,
        }}
      />
      {/* Logo */}
      <div className="relative z-10 mb-10 px-2 py-4">
        <h1 className="text-white font-extrabold text-lg leading-snug tracking-tight">
          Faculty
          <br />
          Accomplishment
          <br />
          Tracker
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {filteredNavItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            to={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === href
              ? "text-white bg-white/15"
              : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
          >
            <Icon size={14} className="shrink-0" />
            {label}
          </Link>
        ))}

        
      </nav>

      {/* Bottom profile link */}
      <div className="mt-auto flex flex-col gap-1">
        <Separator className="bg-white/20 mb-3" />
        <Link
          to="/profile"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === "/profile"
            ? "text-white bg-white/15"
            : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
        >
          <User size={14} className="shrink-0" />
          Your Profile
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white/70 hover:text-white hover:bg-white/10 w-full text-left"
        >
          <LogOut size={14} className="shrink-0" />
          Log out
        </button>
        
      </div>

      
    </aside>
  );
}
