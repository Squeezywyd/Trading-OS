"use client";

import * as React from "react";
import { animate, useReducedMotion } from "framer-motion";

/** Server Components can't pass functions to Client Components (like this
 * one) as props — only serializable values cross that boundary. Callers
 * pass a `format` kind instead, and the actual formatter fn lives here. */
export type NumberFormat = "usd" | "pct" | "r" | "decimal2" | "plain";

const FORMATTERS: Record<NumberFormat, (n: number) => string> = {
  usd: (n) => `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
  pct: (n) => `${n.toFixed(1)}%`,
  r: (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}R`,
  decimal2: (n) => n.toFixed(2),
  plain: (n) => `${n}`,
};

export function AnimatedNumber({
  value,
  format: formatKind,
  suffix,
  className,
}: {
  value: number;
  format?: NumberFormat;
  /** Appended after the formatted number, e.g. " Wins" for a streak. */
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const baseFormat = formatKind ? FORMATTERS[formatKind] : (n: number) => n.toLocaleString();
  const format = suffix ? (n: number) => `${baseFormat(n)} ${suffix}` : baseFormat;

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion) {
      node.textContent = format(value);
      return;
    }

    const from = Number(node.dataset.value ?? 0);
    const controls = animate(from, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = format(v);
        node.dataset.value = String(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  return <span ref={ref} className={className} data-value="0" />;
}
