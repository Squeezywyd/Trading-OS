---
title: "Premium / Discount & OTE"
category: "PD Arrays"
summary: "Range equilibrium, where to buy and sell inside a range, exactly why the 62-79% OTE zone (not just 50%), the 70.5% sweet spot, and extension targets beyond the leg."
use_for: ["Daily Bias", "Entry Model", "Targeting"]
priority: "Core"
slug: "premium-discount-ote"
---

> **Key Point:** Buy in discount, sell in premium. Equilibrium (the 50% of the range) divides them — but the highest-probability entries sit deeper than 50%, inside the 62-79% Optimal Trade Entry band.

## How to measure
- Draw the range from the swing low to the swing high of the leg that broke structure (for a bullish bias), or from swing high to swing low (for a bearish bias).
- **Equilibrium:** the 50% level of that range.
- **Premium:** everything above equilibrium — expensive relative to the range, where you look to sell.
- **Discount:** everything below equilibrium — cheap relative to the range, where you look to buy.

This is range-relative, not a statement about absolute value. A price can be in "premium" of a small range while still being in "discount" of a larger higher-timeframe range — always be explicit about which range you're measuring.

## OTE (Optimal Trade Entry) — why 62-79%, not just 50%
After an impulsive leg (the "displacement" that establishes the range), institutions are modeled to let price retrace only far enough to fill remaining orders at a better price before continuing the original move — not all the way back past equilibrium, and not just a shallow 20-30% pullback either. The **62% to 79%** Fibonacci retracement band is where that "deep enough to be a genuine discount, but not so deep it invalidates the move" pullback most commonly completes.

- **62%:** the shallow edge of the zone.
- **70.5%:** the sweet spot — the algorithmic midpoint between 61.8% and 79%, treated as the single highest-probability level inside the band.
- **79%:** the deep edge. A retracement beyond this starts to look less like a healthy pullback and more like the original leg failing.

Best entries sit where the OTE band overlaps another PD array — an FVG, OB, or RB. OTE alone, with nothing else lining up, is a weaker signal than OTE stacked with one of those.

![Diagram: premium/discount range with the 62-79% OTE band](/theory/diagrams/premium-discount-ote.svg)

## Targets (extensions of the leg)
- **0% (the swing high/low itself):** the first target — usually sitting right at a liquidity pool, since that's often why the leg started there in the first place.
- **-1 and -2 extensions:** expansion targets beyond the original leg, used when displacement is unusually strong and price is likely to run further than the initial swing point.
- Prefer real liquidity pools (resting stops above/below prior swings) over fixed Fibonacci extension numbers whenever one is visible nearby — the market moves toward where the orders are, not toward round Fibonacci numbers for their own sake. Use the extension levels mainly as a fallback when no clear pool is nearby.

### Worked example
NQ sweeps a low at 21,300, then rallies hard to a swing high at 21,460 — a 160-point leg that breaks structure. Equilibrium sits at 21,380. The OTE band (62-79% retracement of that leg, measured from the high back down) runs from roughly 21,361 (62%) down to 21,334 (79%), with the 70.5% sweet spot at 21,347. A pullback into that band, especially if it overlaps a bullish FVG or OB from the original leg, is where you look to buy — targeting back toward 21,460 (0%) first, then the next pool above if displacement is strong.

## Rules
- Long entries look for confluence below 50% of the relevant range (discount); short entries look for confluence above 50% (premium).
- An entry deeper than 79% weakens the read on the structure — it starts to suggest the leg is failing, not just retracing. Beyond 100% (past the origin point of the leg), the leg is invalid; you're no longer looking at a retracement, you're looking at a reversal.
- Use the higher-timeframe range to set directional bias; use the lower-timeframe leg for the actual OTE entry.
- An OTE zone with no PD-array overlap (no FVG, OB, or RB inside it) is a lower-grade setup — trade it smaller or skip it if nothing else lines up.

## Common mistakes
- Treating 50% (equilibrium) as an entry level — it's a bias divider, not the OTE entry zone.
- Entering as soon as price taps 62% without waiting for any reaction or lower-timeframe confirmation.
- Measuring the range from the wrong swing points (using a minor, low-timeframe wiggle instead of the leg that actually broke structure).

## Further study
- [ICT OTE: How to Trade the 62% to 79% Optimal Trade Entry Zone](https://grandalgo.com/blog/ict-optimal-trade-entry-ote)
- [ICT Fibonacci Settings — Exact Fib Levels, OTE 70.5% & Std Deviation](https://innercircletrader.net/tutorials/ict-fibonacci-levels/)
- [Understanding ICT Optimal Trade Entry OTE With Fibonacci](https://tradingstrategyguides.com/understanding-ict-optimal-trade-entry-ote/)
