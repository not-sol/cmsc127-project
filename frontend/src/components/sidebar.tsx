import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Plus, Download, User, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { icon: LayoutGrid, label: "My Reports", href: "/reports" },
  { icon: Plus, label: "Create New Report", href: "/reports/new" },
  { icon: Download, label: "Export Records", href: "/export" },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[#6b0f1a] px-4 py-6">
      {/* Logo */}
      <div className="mb-10 px-2">
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
        {navItems.map(({ icon: Icon, label, href }) => (
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
