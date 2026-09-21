import { toZonedTime } from "date-fns-tz";

export const NY_TZ = "America/New_York";
export const ZURICH_TZ = "Europe/Zurich";

export interface TimeWindow {
  key: string;
  label: string;
  /** Minutes from local midnight, in the window's home zone (NY time). */
  startMinute: number;
  endMinute: number;
  kind: "session" | "killzone" | "silver-bullet";
}

const M = (h: number, m = 0) => h * 60 + m;

/**
 * All windows are defined in NY local time (source of truth for ICT session
 * logic per the spec). Using an IANA zone + date-fns-tz means the underlying
 * UTC offset is resolved correctly across the DST boundary even in the weeks
 * NY and Zurich change on different dates.
 */
export const SESSION_WINDOWS: TimeWindow[] = [
  { key: "asia", label: "Asia", startMinute: M(20), endMinute: M(24), kind: "session" },
  { key: "london", label: "London", startMinute: M(2), endMinute: M(5), kind: "session" },
  { key: "ny-am", label: "NY AM", startMinute: M(8, 30), endMinute: M(11), kind: "session" },
  { key: "ny-lunch", label: "NY Lunch", startMinute: M(12), endMinute: M(13, 30), kind: "session" },
  { key: "ny-pm", label: "NY PM", startMinute: M(13, 30), endMinute: M(16), kind: "session" },
];

export const KILLZONE_WINDOWS: TimeWindow[] = [
  { key: "asian-kz", label: "Asian Killzone", startMinute: M(20), endMinute: M(24), kind: "killzone" },
  { key: "london-kz", label: "London Killzone", startMinute: M(2), endMinute: M(5), kind: "killzone" },
  { key: "ny-am-kz", label: "NY AM Killzone", startMinute: M(7), endMinute: M(10), kind: "killzone" },
  { key: "ny-pm-kz", label: "NY PM Killzone", startMinute: M(13, 30), endMinute: M(16), kind: "killzone" },
];

export const SILVER_BULLET_WINDOWS: TimeWindow[] = [
  { key: "sb-london", label: "London Silver Bullet", startMinute: M(3), endMinute: M(4), kind: "silver-bullet" },
  { key: "sb-am", label: "AM Silver Bullet", startMinute: M(10), endMinute: M(11), kind: "silver-bullet" },
  { key: "sb-pm", label: "PM Silver Bullet", startMinute: M(14), endMinute: M(15), kind: "silver-bullet" },
];

export const POWELL_WINDOW: TimeWindow = {
  key: "powell-10am",
  label: "10am Powell (News Candle)",
  startMinute: M(10),
  endMinute: M(10, 5),
  kind: "silver-bullet",
};

export const ALL_WINDOWS: TimeWindow[] = [
  ...SESSION_WINDOWS,
  ...KILLZONE_WINDOWS,
  ...SILVER_BULLET_WINDOWS,
  POWELL_WINDOW,
];

/** Minutes-since-midnight for `date` as observed in `timeZone` (DST-correct). */
export function minutesInZone(date: Date, timeZone: string): number {
  const zoned = toZonedTime(date, timeZone);
  return zoned.getHours() * 60 + zoned.getMinutes();
}

/** True if `nowMinute` (NY-local minutes-since-midnight) falls inside a window that may wrap past midnight. */
export function isWithinWindow(nowMinute: number, window: TimeWindow): boolean {
  if (window.startMinute <= window.endMinute) {
    return nowMinute >= window.startMinute && nowMinute < window.endMinute;
  }
  // Wraps midnight (e.g. Asia 20:00 -> 24:00 doesn't wrap, but keep this for safety).
  return nowMinute >= window.startMinute || nowMinute < window.endMinute;
}

export function activeWindows(date: Date, windows: TimeWindow[] = ALL_WINDOWS): TimeWindow[] {
  const nowMinute = minutesInZone(date, NY_TZ);
  return windows.filter((w) => isWithinWindow(nowMinute, w));
}

/** Minutes until `window` next opens, relative to `date` (NY-local, wraps to next day). */
export function minutesUntilWindowOpens(date: Date, window: TimeWindow): number {
  const nowMinute = minutesInZone(date, NY_TZ);
  if (nowMinute < window.startMinute) return window.startMinute - nowMinute;
  return 24 * 60 - nowMinute + window.startMinute;
}

export function formatMinutesAsHm(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
