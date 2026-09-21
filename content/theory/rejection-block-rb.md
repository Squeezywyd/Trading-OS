---
title: "Rejection Block (RB)"
category: "PD Arrays"
summary: "The wick zone of a candle at a swing high/low. Entry on the return into the wick, stop beyond the extreme. Needs a sweep and HTF context."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "rejection-block-rb"
---

> **Key Point:** A rejection block is the wick of a candle at a swing extreme. The wick shows where price was refused, so a return into it is a re-test of that refusal.

## Definition
- **Bearish RB:** the upper wick of the candle (or short cluster) at a swing high. Zone runs from the top of the body to the high.
- **Bullish RB:** the lower wick at a swing low. Zone runs from the bottom of the body to the low.
- Key level inside the zone: the **50% of the wick**.

## Validity checklist
- [ ] Wick forms at a swing extreme after a liquidity sweep
- [ ] Wick is large relative to the body (clear refusal)
- [ ] Followed by displacement away from the wick
- [ ] Sits at or inside an HTF PD array (FVG, OB, premium/discount edge)
- [ ] Not from a news spike candle without a second confirmation

## Execution
1. Mark the wick zone and its 50% on the timeframe where it formed.
2. Wait for price to return into the wick during a killzone.
3. Enter at the 50% or on the LTF MSS inside the zone.
4. **Stop:** just beyond the wick extreme.
5. **Target:** first opposing liquidity pool.

## Invalidation
- Body closes beyond the wick extreme. RB is void.
- Price trades through the 50% and closes above/below it: weakened, cut or skip.

## Versus OB
- OB uses the candle body before displacement. RB uses the wick at the extreme.
- The stop in an RB is tighter, because the extreme is right there. Risk is smaller but the zone is thin, so entry precision matters.
- Both stack: an RB inside an OB or FVG is an A-grade zone.
