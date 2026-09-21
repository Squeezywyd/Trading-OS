import { describe, expect, it } from "vitest";
import { calcSetupGrade } from "../grade";

describe("calcSetupGrade", () => {
  it("grades A+ only at 100%", () => {
    expect(calcSetupGrade(6, 6)).toBe("A+");
  });

  it("grades A at >=80%, B at >=60%, C below that", () => {
    expect(calcSetupGrade(8, 10)).toBe("A");
    expect(calcSetupGrade(6, 10)).toBe("B");
    expect(calcSetupGrade(3, 10)).toBe("C");
  });

  it("returns null for an empty checklist", () => {
    expect(calcSetupGrade(0, 0)).toBeNull();
  });
});
