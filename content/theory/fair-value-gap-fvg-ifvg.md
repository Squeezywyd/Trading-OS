---
title: "Fair Value Gap (FVG) & IFVG"
category: "PD Arrays"
summary: "Three-candle imbalance. How to mark it, consequent encroachment, when it becomes an inverse FVG, and how to use it for entries and targets."
use_for: ["Entry Model", "Confirmation", "Targeting"]
priority: "Core"
slug: "fair-value-gap-fvg-ifvg"
---

> **Key Point:** An FVG is the gap between candle 1 and candle 3 that candle 2's move left untraded. It marks aggressive one-sided delivery and price tends to return to rebalance.

## Definition
- **Bullish FVG (BISI):** high of candle 1 is below low of candle 3. The gap is that space.
- **Bearish FVG (SIBI):** low of candle 1 is above high of candle 3.
- **Consequent encroachment (CE):** the 50% of the gap. Key level.

## Use cases
1. **Entry:** retrace after MSS into the FVG the displacement left.
2. **Confirmation:** an FVG on the break proves displacement.
3. **Target:** unfilled FVG in the trade direction is a magnet.

## Execution
- Enter at the FVG edge (aggressive) or CE (standard).
- **Stop:** beyond candle 1's extreme for that side (bullish: below candle 1 low), or beyond candle 2 for a tighter stop.
- Respected = wick into the FVG, close outside. CE tag then hold = strongest.

## Invalidation and IFVG
- Body closes fully through the FVG = failed.
- **IFVG (inverse FVG):** a failed FVG that price retests from the other side and rejects. Bullish FVG closed through becomes bearish IFVG (resistance).
- Trade IFVG like a breaker: entry at the retest, stop beyond the IFVG far edge.

## Quality filters
- Large gap relative to ATR = strong. Tiny gaps in chop = ignore.
- Formed by displacement with bodies, not overlapping candles.
- Aligned with HTF bias and killzone.
- Stacked with OB or RB = A-grade.
