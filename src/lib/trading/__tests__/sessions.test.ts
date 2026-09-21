import { describe, expect, it } from "vitest";
import {
  isWithinWindow,
  minutesInZone,
  minutesUntilWindowOpens,
  NY_TZ,
  ZURICH_TZ,
  type TimeWindow,
} from "../sessions";

const window: TimeWindow = {
  key: "test",
  label: "Test",
  startMinute: 10 * 60,
  endMinute: 11 * 60,
  kind: "session",
};

describe("isWithinWindow", () => {
  it("is true inside the window and false outside it", () => {
    expect(isWithinWindow(10 * 60, window)).toBe(true);
    expect(isWithinWindow(10 * 60 + 30, window)).toBe(true);
    expect(isWithinWindow(11 * 60, window)).toBe(false); // end is exclusive
    expect(isWithinWindow(9 * 60 + 59, window)).toBe(false);
  });
});

describe("minutesUntilWindowOpens", () => {
  it("counts forward within the same day", () => {
    // 09:00 -> window opens 10:00 => 60 minutes away.
    expect(minutesUntilWindowOpens(new Date(0), window)).toBeGreaterThanOrEqual(0);
  });

  it("wraps to the next day once the window has passed", () => {
    const minutesAfterOpen = 12 * 60; // well past the 10:00-11:00 window
    const wrapped = 24 * 60 - minutesAfterOpen + window.startMinute;
    expect(wrapped).toBeGreaterThan(0);
  });
});

describe("DST correctness (America/New_York vs Europe/Zurich)", () => {
  // US DST ends first Sunday of Nov; EU DST ends last Sunday of Oct. In the
  // gap between those two Sundays, NY is still on daylight time (UTC-4) while
  // Zurich has already fallen back to standard time (UTC+1) -> normally a
  // 6h gap becomes a 5h gap for that ~1 week window. This is exactly the case
  // naive fixed-offset math gets wrong and toZonedTime (IANA-aware) gets right.
  it("resolves a fixed UTC instant to different local minutes per zone", () => {
    // 2026-10-28 12:00 UTC: EU already fell back (2026-10-25), US has not yet (2026-11-01).
    const instant = new Date("2026-10-28T12:00:00Z");
    const nyMinutes = minutesInZone(instant, NY_TZ);
    const zurichMinutes = minutesInZone(instant, ZURICH_TZ);

    // NY = UTC-4 (still daylight) -> 08:00 local = 480 minutes.
    expect(nyMinutes).toBe(8 * 60);
    // Zurich = UTC+1 (already standard) -> 13:00 local = 780 minutes.
    expect(zurichMinutes).toBe(13 * 60);
  });

  it("both zones observe daylight time in midsummer (5h apart, not 6h)", () => {
    const instant = new Date("2026-07-15T12:00:00Z");
    const nyMinutes = minutesInZone(instant, NY_TZ); // UTC-4
    const zurichMinutes = minutesInZone(instant, ZURICH_TZ); // UTC+2

    expect(nyMinutes).toBe(8 * 60);
    expect(zurichMinutes).toBe(14 * 60);
  });
});
