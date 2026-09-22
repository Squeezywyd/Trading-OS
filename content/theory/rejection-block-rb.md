---
title: "Rejection Block (RB)"
category: "PD Arrays"
summary: "The wick zone of a candle at a swing high/low — the ICT wick-based level, distinct from an order block's body-based zone. Entry on the return into the wick, stop beyond the extreme."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "rejection-block-rb"
---

> **Key Point:** A rejection block is the wick of a candle at a swing extreme. The wick shows exactly where price was refused, so a later return into it is a re-test of that refusal — the late participants who got filled at the worst prices there are effectively stranded.

## How it forms
Price probes beyond a key area — often driven by algorithms hunting resting stop-loss orders or breakout entries above/below a swing point — and rejects sharply. A swing high formed on a long upper wick leaves the span from the top of the candle's body up to the wick's extreme as a **bearish rejection block**. The bullish version mirrors it: a swing low with a long lower wick, marked from the bottom of the body down to the low.

## Definition
- **Bearish RB:** the upper wick of the candle (or a short cluster of candles) at a swing high. The zone runs from the top of the body up to the high.
- **Bullish RB:** the lower wick at a swing low. The zone runs from the bottom of the body down to the low.
- Key level inside the zone: the **50% of the wick** — the midpoint between the body edge and the extreme.

## Versus an order block
This is the distinction that trips people up: an OB uses the candle **body** before displacement; an RB uses the **wick** at the extreme. They can occur on completely different candles. An OB tells you where positions were built before a move; an RB tells you exactly where a probe failed and reversed. Because the RB's stop reference (the wick extreme) sits right at the zone's edge, the resulting stop is tighter and risk is smaller — but the zone itself is thinner, so entry precision matters more than with an OB.

## Validity checklist
- [ ] Wick forms at a genuine swing extreme, ideally right after a liquidity sweep
- [ ] Wick is large relative to the candle's body — a clear, visible refusal, not a minor tail
- [ ] Followed by displacement away from the wick that breaks structure
- [ ] Sits at or inside a higher-timeframe PD array — an FVG, an OB, or a premium/discount edge
- [ ] Not the product of a raw news-spike candle without a second confirming candle

## Execution
1. Mark the wick zone and its 50% on the timeframe where it formed.
2. Wait for price to return into the wick, ideally during a killzone.
3. Enter at the 50% level, or on a lower-timeframe MSS inside the zone for tighter confirmation.
4. **Stop:** just beyond the wick's extreme.
5. **Target:** the first opposing liquidity pool.

### Worked example
NQ prints a swing high with a candle whose body tops out at 21,410 but wicks up to 21,432 before slamming back down and breaking structure lower. The bearish RB runs from 21,410 to 21,432, with its 50% at 21,421. On a later retrace into that band, 21,421 is the first level you watch for a rejection back down; the stop sits just above 21,432.

![Diagram: rejection block — the wick-defined zone at a swing high](/theory/diagrams/rejection-block-rb.svg)

## Invalidation
- A body **closes beyond** the wick's extreme — the RB is void, not just weakened.
- Price trades through the 50% and **closes** on the far side of it: the zone is weakened; cut the trade or skip the setup rather than holding through it.

## Confluence
Both OB and RB stack: a rejection block that sits inside (or right next to) an order block or FVG is an A-grade zone — three independent methods pointing at the same price is a much stronger signal than any one alone.

## Common mistakes
- Marking the RB off the full candle range instead of body-top-to-wick-extreme.
- Trading a wick from a raw news spike as if it were a normal liquidity-driven rejection — spike wicks need a second confirming candle before you trust them.
- Ignoring wick size relative to the body; a barely-there wick is not a rejection block.

## Further study
- [Rejection Block Trading: The ICT Wick-Based Entry Explained](https://grandalgo.com/blog/rejection-block-trading)
- [Rejection Block — Smart Money Concepts / ICT Concept, LuxAlgo Library](https://www.luxalgo.com/library/concept/rejection-block/)
- [ICT Rejection Block: Trade the Wick That Traps Retail](https://fxnx.com/en/blog/ict-rejection-block-trade-wick-traps-retail)
