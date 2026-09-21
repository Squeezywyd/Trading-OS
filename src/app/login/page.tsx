import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="glow-primary bg-primary/10 flex size-11 items-center justify-center rounded-xl">
            <TrendingUp className="text-primary size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Trading OS</h1>
            <p className="text-muted-foreground text-sm">ICT/SMC bias, journal &amp; analytics</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Single-user system. Sign-ups are disabled — this account was created directly in Supabase.
        </p>
      </div>
    </div>
  );
}
