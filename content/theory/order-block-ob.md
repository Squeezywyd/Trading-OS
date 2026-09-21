---
title: "Order Block (OB)"
category: "PD Arrays"
summary: "Last opposing candle before displacement that breaks structure. Rules for valid OBs, entry points, stops and invalidation."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "order-block-ob"
---

> **Key Point:** An OB is the last opposing candle before displacement. It is a zone where the move started, so price often returns to it.

## Definition
- **Bullish OB:** last down-close candle before an up move that breaks structure or takes out a high.
- **Bearish OB:** last up-close candle before a down move that breaks structure or takes out a low.

## Validity checklist (all must be true)
- [ ] Preceded by a liquidity sweep (or it formed at a swing extreme)
- [ ] Followed by displacement that leaves an FVG
- [ ] The move broke market structure (MSS or BOS)
- [ ] Longs sit in discount, shorts in premium of the current range
- [ ] It is not already mitigated (price has not traded back through it)

## Levels
- **Open of the candle:** first entry level.
- **50% (mean threshold) of the body:** most-used level. Price holding above it = respected.
- **Stop:** beyond the OB extreme, or beyond the sweep extreme for a tighter, cleaner invalidation.
- **Target:** next liquidity pool.

## Execution
1. Mark the OB on the HTF (15m/1h).
2. Wait for price to return into it during a killzone.
3. Drop to the entry timeframe. Wait for LTF MSS or reaction candle.
4. Enter, stop beyond the OB, target the pool.

## Invalidation
- Body closes fully through the OB. It flips: bullish OB becomes a **breaker** (see Breaker Block).
- Price trades through the 50% of the body without reaction: treat as weak.

## Grade
- **A+:** sweep, MSS, FVG, HTF PD alignment, killzone.
- **B:** one of those missing.
- **Skip:** no displacement.
