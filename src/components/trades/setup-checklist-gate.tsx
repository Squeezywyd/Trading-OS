"use client";

import * as React from "react";
import Link from "next/link";
import type { ChecklistItem } from "@/lib/trading/checklist";
import { calcSetupGrade } from "@/lib/trading/grade";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { SetupGrade } from "@/lib/constants/enums";

const GRADE_TONE: Record<SetupGrade, string> = {
  "A+": "text-profit",
  A: "text-profit",
  B: "text-amber-500",
  C: "text-loss",
};

export function SetupChecklistGate({
  items,
  onGradeChange,
}: {
  items: ChecklistItem[];
  onGradeChange: (grade: SetupGrade | null) => void;
}) {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const grade = calcSetupGrade(checkedCount, items.length);

  React.useEffect(() => {
    onGradeChange(grade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  if (items.length === 0) {
    return (
      <div className="glass-panel p-5 text-center">
        <p className="text-muted-foreground text-sm">
          No A+ Setup Checklist found —{" "}
          <Link href="/theory" className="text-primary underline">
            add one in the Theory Library
          </Link>{" "}
          (slug <code className="bg-muted rounded px-1 py-0.5 text-xs">a-setup-checklist</code>) to grade setups automatically.
        </p>
      </div>
    );
  }

  const bySection = new Map<string, ChecklistItem[]>();
  for (const item of items) {
    const key = item.section ?? "Checklist";
    bySection.set(key, [...(bySection.get(key) ?? []), item]);
  }

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex items-center justify-between">
        <p className="label-muted">A+ Setup Checklist</p>
        {grade ? (
          <Badge variant="outline" className={GRADE_TONE[grade]}>
            {grade} · {checkedCount}/{items.length}
          </Badge>
        ) : null}
      </div>

      <div className="space-y-4">
        {[...bySection.entries()].map(([section, sectionItems]) => (
          <div key={section}>
            <p className="text-muted-foreground mb-1.5 text-xs font-medium">{section}</p>
            <div className="space-y-1.5">
              {sectionItems.map((item) => (
                <label key={item.key} className="flex cursor-pointer items-start gap-2 text-sm">
                  <Checkbox
                    checked={checked[item.key] ?? false}
                    onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item.key]: v === true }))}
                    className="mt-0.5"
                  />
                  <span className={checked[item.key] ? "text-foreground" : "text-muted-foreground"}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
