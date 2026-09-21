import {
  LayoutDashboard,
  Sunrise,
  NotebookPen,
  CalendarDays,
  BarChart3,
  ClipboardList,
  BookOpen,
  Wrench,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  /** Shown in the bottom nav on mobile (keep this list short). */
  mobile?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "G D", mobile: true },
  { label: "Daily Prep", href: "/prep", icon: Sunrise, shortcut: "G P", mobile: true },
  { label: "Trade Journal", href: "/journal", icon: NotebookPen, shortcut: "G J", mobile: true },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, shortcut: "G C", mobile: true },
  { label: "Analytics", href: "/analytics", icon: BarChart3, shortcut: "G A" },
  { label: "Weekly Recap", href: "/recap", icon: ClipboardList, shortcut: "G W" },
  { label: "Theory Library", href: "/theory", icon: BookOpen, shortcut: "G T", mobile: true },
  { label: "Tools", href: "/tools", icon: Wrench, shortcut: "G O" },
  { label: "Settings", href: "/settings", icon: Settings, shortcut: "G S" },
];
