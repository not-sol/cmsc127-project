import BackgroundPattern from "@/components/BackgroundPattern";
import LoginCard from "@/components/LoginCard";

export default function LoginPage() {
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm mx-6 md:mx-0 md:mr-16">
        <LoginCard />
      </div>
    </div>
  );
}

