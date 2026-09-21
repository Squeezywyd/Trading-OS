import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  formatter,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: number;
  formatter?: (n: number) => string;
  icon?: LucideIcon;
  tone?: "profit" | "loss" | "neutral";
  hint?: string;
}) {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between">
        <p className="label-muted">{label}</p>
        {Icon ? <Icon className="text-muted-foreground size-3.5" /> : null}
      </div>
      <p
        className={cn(
          "mt-1.5 font-mono text-2xl font-semibold tabular-nums",
          tone === "profit" && "text-profit",
          tone === "loss" && "text-loss",
        )}
      >
        <AnimatedNumber value={value} formatter={formatter} />
      </p>
      {hint ? <p className="text-muted-foreground mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
