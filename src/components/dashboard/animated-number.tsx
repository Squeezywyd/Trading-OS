"use client";

import * as React from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({
  value,
  formatter,
  className,
}: {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const format = formatter ?? ((n: number) => n.toLocaleString());

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
