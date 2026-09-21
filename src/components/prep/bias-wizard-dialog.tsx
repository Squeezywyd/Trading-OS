"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { computeDailyBias, type BiasWizardInputs, type BiasWizardResult } from "@/lib/trading/bias";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

const DEFAULTS: BiasWizardInputs = {
  htfDraw: "Neutral",
  premiumDiscount: "Equilibrium",
  previousDayClose: "Inside Range",
  wickRejection: "None",
  dayType: "Normal",
  highImpactNewsToday: false,
};

function StepToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[value]}
          onValueChange={(v: string[]) => v[0] && onChange(v[0] as T)}
          className="flex flex-wrap"
        >
          {options.map((o) => (
            <ToggleGroupItem key={o} value={o}>
              {o}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldContent>
    </Field>
  );
}

export function BiasWizardDialog({ onApply }: { onApply: (result: BiasWizardResult) => void }) {
  const [open, setOpen] = React.useState(false);
  const [inputs, setInputs] = React.useState<BiasWizardInputs>(DEFAULTS);

  const result = computeDailyBias(inputs);

  function patch<K extends keyof BiasWizardInputs>(key: K, value: BiasWizardInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <Sparkles />
            Bias Wizard
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Daily Bias: Top-Down Process</DialogTitle>
          <DialogDescription>
            Walk the top-down checklist. The call below updates live.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <StepToggle
            label="HTF draw on liquidity"
            value={inputs.htfDraw}
            options={["Bullish", "Bearish", "Neutral"] as const}
            onChange={(v) => patch("htfDraw", v)}
          />
          <StepToggle
            label="Premium / discount"
            value={inputs.premiumDiscount}
            options={["Premium", "Discount", "Equilibrium"] as const}
            onChange={(v) => patch("premiumDiscount", v)}
          />
          <StepToggle
            label="Previous day closed"
            value={inputs.previousDayClose}
            options={["Above PDH", "Below PDL", "Inside Range"] as const}
            onChange={(v) => patch("previousDayClose", v)}
          />
          <StepToggle
            label="Wick-back rejection"
            value={inputs.wickRejection}
            options={["None", "Rejected High", "Rejected Low"] as const}
            onChange={(v) => patch("wickRejection", v)}
          />
          <StepToggle
            label="Day type"
            value={inputs.dayType}
            options={["Normal", "Inside Day", "Outside Day"] as const}
            onChange={(v) => patch("dayType", v)}
          />

          <Field orientation="horizontal">
            <FieldLabel>High-impact news today</FieldLabel>
            <Switch
              checked={inputs.highImpactNewsToday}
              onCheckedChange={(v) => patch("highImpactNewsToday", v)}
            />
          </Field>

          <div className="glass-panel-flat flex items-center justify-between p-3">
            <div>
              <p className="label-muted">Call</p>
              <p className="text-lg font-semibold">{result.dailyBias}</p>
            </div>
            <Badge variant="outline">{result.confidence} confidence</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              onApply(result);
              setOpen(false);
            }}
          >
            Apply to prep
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
