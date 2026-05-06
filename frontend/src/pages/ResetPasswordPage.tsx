import BackgroundPattern from "@/components/background-pattern";
import ResetPasswordCard from "@/components/reset-password-card";

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundPattern />

      <div className="relative z-10 hidden md:flex flex-col justify-center px-14 flex-1 max-w-xl">
        <h1 className="text-white font-bold leading-tight mb-4 text-4xl">
          Secure Your Account
        </h1>
        <p className="text-white/55 text-sm leading-relaxed max-w-xs">
          Choose a strong password to protect your faculty records.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-6 md:mx-0 md:mr-16">
        <ResetPasswordCard />
      </div>
    </div>
  );
}
