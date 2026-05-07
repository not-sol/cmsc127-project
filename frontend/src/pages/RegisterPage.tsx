import { Navigate, Link } from "react-router-dom";
import BackgroundPattern from "@/components/background-pattern";
import RegisterCard from "@/components/register-card";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/reports" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundPattern />

      <div className="relative z-10 hidden md:flex flex-col justify-center px-14 flex-1 max-w-xl">
        <h1 className="text-white font-bold leading-tight mb-4 text-4xl">
          Faculty Accomplishment
          <br />
          Tracker
        </h1>

        <p className="text-white/55 text-sm leading-relaxed max-w-xs">
          ISIP-based reporting with PBMS-compatible export
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-6 md:mx-0 md:mr-16">
        <RegisterCard />
        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-white/70 hover:text-white underline underline-offset-4">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
