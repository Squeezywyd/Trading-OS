---
title: "Fair Value Gap (FVG) & IFVG"
category: "PD Arrays"
summary: "Three-candle imbalance. Exact rules for marking it, consequent encroachment, when it inverts into an IFVG, and how to use it for entries, confirmation and targets."
use_for: ["Entry Model", "Confirmation", "Targeting"]
priority: "Core"
slug: "fair-value-gap-fvg-ifvg"
---

> **Key Point:** An FVG is the gap between candle 1 and candle 3 that candle 2's move left untraded. It marks aggressive, one-sided delivery — one side (buyers or sellers) never got a fair, two-sided auction — and price tends to return to rebalance it before continuing.

## Why it exists
Normal price delivery is two-sided: every tick has a buyer and a seller trading at a fair price. When a large participant (or an algorithm working a large order) needs to move price fast — often to reach a liquidity pool or to escape a level before news — it can outrun the opposite side of the order book. The candle that does this (candle 2) leaves a hole between where candle 1 stopped and candle 3 started. That hole is inefficient pricing: nobody transacted there. Price often returns to "fill" it later, not because of some mystical magnetism, but because resting orders, stops and re-entries cluster around the edges of that inefficiency.

## Definition (three candles, precise)
- **Bullish FVG (also called BISI — Buyside Imbalance / Sellside Inefficiency):** the high of candle 1 is below the low of candle 3. The gap runs from candle 1's high up to candle 3's low.
- **Bearish FVG (SIBI — Sellside Imbalance / Buyside Inefficiency):** the low of candle 1 is above the high of candle 3. The gap runs from candle 3's high down to candle 1's low.
- Candle 2 is the displacement candle — it must have a real body, not just a long wick, and it should be visibly larger than the candles around it.
- **Consequent encroachment (CE):** draw a Fibonacci (or just measure) across the gap and mark the exact 50% level. This midpoint is where institutional pricing algorithms are commonly modeled to treat the gap as "fair," so it is the single most reacted-to level inside the zone.

### Worked example
Say candle 1 (a down candle) has a high of 20,010 on MNQ. Candle 2 displaces hard higher. Candle 3 (an up candle) has a low of 20,022. The bullish FVG runs from 20,010 to 20,022 — a 12-point gap. The CE sits at 20,016. If price retraces into this zone later in the session, 20,016 is the level you watch first for a reaction, not the top or bottom edge.

## Use cases
1. **Entry:** after an MSS (market structure shift), the FVG left by the displacement leg is the primary retracement entry — enter on the retrace into the gap, ideally at or through the CE.
2. **Confirmation:** an FVG forming on the break of structure is what separates real displacement from a slow grind. No FVG on the break = weak, treat the level as unconfirmed.
3. **Target:** an untouched FVG sitting between current price and your intended target acts as a magnet — price is statistically likely to at least tap it before reversing.

## Execution
- **Aggressive entry:** the near edge of the gap (the edge closer to current price as it retraces).
- **Standard entry:** the CE (50%).
- **Conservative entry:** wait for a lower-timeframe reaction candle or LTF MSS inside the zone before entering.
- **Stop:** beyond candle 1's extreme for that side (bullish: below candle 1's low), or beyond candle 2's extreme for a tighter, higher-risk stop.
- A **respected** FVG shows a wick tag into the zone with the candle closing back outside it. A CE tag followed by a hold is the strongest signal the level is still defended.

## Invalidation and the IFVG
- A body **closing fully through** the FVG (not just wicking into it) marks it failed for its original direction.
- **Inverse FVG (IFVG):** once a gap has failed, price often returns to retest it from the other side — and treats it as the opposite kind of level. A bullish FVG that gets closed through becomes a bearish IFVG (now resistance instead of support), and a bearish FVG that gets closed through becomes a bullish IFVG (now support instead of resistance).
- Some traders require the *entire* gap to be closed through before calling it inverted; others act as soon as price closes beyond the CE. Decide which rule you're using and apply it consistently — mixing the two mid-session is how you talk yourself into a bad entry.
- Trade an IFVG like a breaker block: entry on the retest, stop beyond the IFVG's far edge (the original gap's opposite boundary).

![Diagram: Fair Value Gap formation and its Inverse FVG flip](/theory/diagrams/fair-value-gap-fvg-ifvg.svg)

## Quality filters
- **Size relative to ATR:** a gap that's a large fraction of the recent average true range is a strong signal; a sliver of a gap inside chop is noise — ignore it.
- **Formed by real bodies, not overlapping wicks.** Overlapping candle ranges with only wick-thin gaps between them are not tradeable FVGs.
- **Aligned with HTF bias and killzone timing.** An FVG that forms outside a killzone, against your daily bias, is lower quality even if it technically qualifies.
- **Stacked with an OB or RB** (the two zones overlap) is an A-grade confluence — see [Order Block](/theory/order-block-ob) and [Rejection Block](/theory/rejection-block-rb).

## Common mistakes
- Marking a gap off wicks instead of the candle 1 high / candle 3 low rule.
- Trading every tiny FVG regardless of size — most are noise in a ranging market.
- Ignoring that a body close through the gap invalidates it for the original direction; holding a long bias through a closed bullish FVG because "it might still hold."
- Forgetting the CE — anchoring entries to the visual edges of the zone instead of the actual 50% level that matters most.

## Further study
- [ICT Fair Value Gap (FVG) — 6-Step Strategy & FVG Family](https://innercircletrader.net/tutorials/fair-value-gap-trading-strategy/)
- [ICT Inverse Fair Value Gap (IFVG) — Inversion FVG Setup with Examples](https://innercircletrader.net/tutorials/ict-inversion-fair-value-gap/)
- [ICT CE: Precision FVG Entries at the 50% Midpoint](https://fxnx.com/en/blog/ict-consequent-encroachment-precision-fvg-entry)
- [Inversion FVG — Smart Money Concepts / ICT Concept, LuxAlgo Library](https://www.luxalgo.com/library/concept/inversion-fvg/)
