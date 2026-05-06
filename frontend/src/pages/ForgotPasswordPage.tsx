import { Navigate } from "react-router-dom";
import BackgroundPattern from "@/components/background-pattern";
import ForgotPasswordCard from "@/components/forgot-password-card";
import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to="/reports" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundPattern />

      <div className="relative z-10 hidden md:flex flex-col justify-center px-14 flex-1 max-w-xl">
        <h1 className="text-white font-bold leading-tight mb-4 text-4xl">
          Account Recovery
        </h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xs">
          Forgot your password? No worries, we'll help you get back in.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-6 md:mx-0 md:mr-16">
        <ForgotPasswordCard />
      </div>
    </div>
  );
}
