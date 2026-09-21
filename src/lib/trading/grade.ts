import type { SetupGrade } from "@/lib/constants/enums";

/**
 * Setup Grade is derived from the A+ Setup Checklist (Theory Library):
 * 100% checked -> A+, >=80% -> A, >=60% -> B, otherwise C. The checklist
 * itself is authored/edited content (theory_docs + theory_checklist_state),
 * so this stays a generic percentage gate rather than hard-coded item names.
 */
export function calcSetupGrade(checkedCount: number, totalCount: number): SetupGrade | null {
  if (totalCount <= 0) return null;
  const pct = checkedCount / totalCount;
  if (pct >= 1) return "A+";
  if (pct >= 0.8) return "A";
  if (pct >= 0.6) return "B";
  return "C";
}
