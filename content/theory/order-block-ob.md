---
title: "Order Block (OB)"
category: "PD Arrays"
summary: "Last opposing candle before displacement that breaks structure. Precise validity rules, entry levels, stops, the common beginner mistake, and how it fails into a breaker."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "order-block-ob"
---

> **Key Point:** An OB is the last opposing candle before displacement. It marks the footprint of position-building — where large orders were absorbed just before price was driven away — so price often returns to it before continuing.

## Why it works
Smart-money-concepts logic treats an order block as evidence of institutional order flow, not retail candle-pattern reading. A bullish OB forms when large participants sell into resting liquidity to accumulate a long position, leaving one final down-close candle right before an explosive rally. A bearish OB is the mirror: buying into liquidity to build shorts, leaving one final up-close candle before a breakdown. The zone matters because the unfilled portion of that original order is still sitting there — if price returns, the theory is that those orders (or the algorithm managing them) are still active and will defend the level.

## Definition
- **Bullish OB:** the last down-close candle (or the last of a consecutive cluster of down-close candles) before an up move that breaks structure or takes out a swing high.
- **Bearish OB:** the last up-close candle before a down move that breaks structure or takes out a swing low.
- The candle's **full body** defines the zone — not its wick (that's a [Rejection Block](/theory/rejection-block-rb) instead).

## Validity checklist (all must be true)
- [ ] Preceded by a liquidity sweep, or it formed at a genuine swing extreme
- [ ] Followed by displacement that leaves an FVG (see [Fair Value Gap](/theory/fair-value-gap-fvg-ifvg))
- [ ] The move broke market structure (MSS or BOS — see [Market Structure](/theory/market-structure-bos-mss-displacement))
- [ ] Longs sit in discount, shorts in premium of the current range (see [Premium/Discount & OTE](/theory/premium-discount-ote))
- [ ] It is not already mitigated (price has not already traded back through it and moved away)

## The common beginner mistake
New traders mark "the last down candle before price went up" mechanically, without checking displacement or structure. That produces dozens of false OBs a day — most candle-before-a-bounce moments are not institutional order blocks, they're noise. The zone only qualifies if the move away from it **breaks structure**. A down-close candle before a bounce that stays inside the existing range is not an OB; it's just a pullback candle. Always work backward from a confirmed MSS or BOS to find the OB that caused it, never forward from "this candle looks like it started something."

## Levels inside the zone
- **Open of the candle:** the first, most aggressive entry level.
- **50% (mean threshold) of the body:** the most-used level. Price holding above it on a return (for a bullish OB) is the sign it's respected.
- **Stop:** beyond the OB's extreme (the far end of the candle's wick), or beyond the sweep's extreme for a tighter, cleaner invalidation if the OB formed right after a sweep.
- **Target:** the next untouched liquidity pool in the trade's direction.

## Execution
1. Mark the OB on the higher timeframe (15m or 1h) where the structural break is clean.
2. Wait for price to return into the zone, ideally during a killzone (see [Sessions & Killzones](/theory/sessions-killzones-ny-time)).
3. Drop to the entry timeframe (1m-5m) once price is inside the zone. Wait for a lower-timeframe MSS or a clear reaction candle.
4. Enter, place the stop beyond the OB (or the sweep extreme), target the next liquidity pool.

### Worked example
Price on MNQ sweeps a session low at 20,050, then rallies and breaks the prior swing high at 20,120 with a strong displacement candle. Walking back from that break, the last down-close candle before the rally opened at 20,058 and closed at 20,051 — that's the bullish OB, with its 50% around 20,054.5. Later, price pulls back into that zone; you watch for a reaction at 20,054.5, enter long, and place the stop just under 20,050 (the sweep extreme) rather than the full OB low, for a tighter risk.

## Invalidation
- A **body closes fully through** the OB (not just a wick tag) — it has failed. The zone flips polarity and becomes a **breaker block** (see [Breaker & Mitigation Block](/theory/breaker-mitigation-block)).
- Price trades through the 50% of the body without any reaction: treat the zone as weakened even if it hasn't fully failed yet.

![Diagram: bullish order block formation, zone and entry](/theory/diagrams/order-block-ob.svg)

## Grade
- **A+:** sweep, MSS, FVG left behind, HTF PD-array alignment, formed inside a killzone.
- **A:** one of the above is missing but the rest hold.
- **Skip:** no displacement, or the "OB" candle didn't actually precede a structural break.

## Further study
- [ICT Order Block: What Makes One Valid (Complete Guide)](https://www.ictkillzone.com/ict-order-block)
- [ICT Order Block Explained — Bullish & Bearish OB Setup with Examples](https://innercircletrader.net/tutorials/ict-order-block/)
- [Bullish/Bearish Order Block — Smart Money Concepts / ICT Concept, LuxAlgo Library](https://www.luxalgo.com/library/concept/bullish-bearish-order-block/)
