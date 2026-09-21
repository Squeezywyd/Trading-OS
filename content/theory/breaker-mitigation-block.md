---
title: "Breaker & Mitigation Block"
category: "PD Arrays"
summary: "Failed order blocks that flip polarity. Breaker requires a liquidity sweep before the break, mitigation block does not."
use_for: ["Entry Model", "Confirmation"]
priority: "Secondary"
slug: "breaker-mitigation-block"
---

> **Key Point:** A breaker is an order block that failed. The zone flips role: old support becomes resistance, old resistance becomes support.

## Breaker block
Bearish breaker (from a failed bullish OB):
1. Price makes a swing high.
2. Price sweeps the sell-side (takes a low), then body-closes **through** the bullish OB.
3. Displacement down leaves an FVG.
4. The failed OB is now a bearish breaker. Sell on retrace into it.

Bullish breaker is the mirror.

## Mitigation block
Same failure, but **no liquidity sweep** on the way. Price makes a lower high (or higher low) instead of taking the opposing extreme.
- Weaker than a breaker.
- Use only with HTF alignment.

| | Breaker | Mitigation block |
| --- | --- | --- |
| Sweep of opposing liquidity | Yes | No |
| Structure break | MSS with displacement | MSS with displacement |
| Strength | Higher | Lower |

## Rules
- Entry: at the breaker open or its 50%. Stop beyond the breaker extreme.
- Target: first pool in the new direction.
- Invalid: body closes back through the breaker. It has failed twice, drop it.
- Best when it overlaps an FVG or sits at premium (shorts) / discount (longs).
