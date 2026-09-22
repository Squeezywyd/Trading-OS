---
title: "Breaker & Mitigation Block"
category: "PD Arrays"
summary: "Failed order blocks that flip polarity. The precise distinction: breaker requires a liquidity sweep before the break, mitigation block does not — and that difference changes how strong the zone is."
use_for: ["Entry Model", "Confirmation"]
priority: "Secondary"
slug: "breaker-mitigation-block"
---

> **Key Point:** A breaker is an order block that failed. The zone flips role: old support becomes resistance, old resistance becomes support. A mitigation block is the same role-flip, but weaker, because it happened without a liquidity sweep first.

## The distinction beginners conflate
Both a breaker and a mitigation block are "an order block that got closed through and now trades the other way." The difference is entirely about **what happened right before the failure**:

- **Breaker:** the swing first succeeds — price takes out the prior high or low (sweeping the resting liquidity there), *then* reverses hard enough to close through the OB. The failed side got their stops run first.
- **Mitigation block:** the swing *fails to reach* the prior extreme — price makes a lower high (in a downtrend) or a higher low (in an uptrend) instead of sweeping it, then reverses through the OB anyway.

Because the breaker's reversal happened only after liquidity was taken, it reflects a cleaner, more decisive shift in order flow — that's why it's graded stronger. A mitigation block's reversal happened without that confirmation, so it's read as weaker and used mainly as a continuation tool, not a standalone reversal signal.

## Breaker block — bearish example (from a failed bullish OB)
1. Price makes a swing high, then pulls back and forms a bullish OB.
2. Price rallies again but this time sweeps the sell-side (takes out a prior low) instead of holding — then **body-closes through** the bullish OB.
3. Displacement down leaves an FVG behind it.
4. The failed OB is now a **bearish breaker**. Sell on a retrace into it.

The bullish breaker (from a failed bearish OB) is the exact mirror: price sweeps a prior high first, then closes back up through the bearish OB, and that zone becomes support.

## Mitigation block — same failure, no sweep
Price approaches the prior swing extreme but doesn't reach it — it prints a lower high or higher low — and then reverses through the OB anyway. There was no liquidity grab to confirm the reversal, so treat it as a lower-conviction, continuation-only zone. Only use it with strong higher-timeframe alignment; don't trade it standalone the way you might trade a clean breaker.

| | Breaker | Mitigation block |
| --- | --- | --- |
| Sweep of opposing liquidity first | Yes | No |
| Structure break | MSS with displacement | MSS with displacement |
| Conviction | Higher — liquidity was taken before the flip | Lower — no confirming sweep |
| Best used as | Reversal or continuation | Continuation only |

![Diagram: breaker (sweep then flip) versus mitigation block (no sweep, weaker flip)](/theory/diagrams/breaker-mitigation-block.svg)

## Rules
- **Entry:** at the breaker's open or its 50% level. Stop beyond the breaker's extreme (the far edge, opposite your entry side).
- **Target:** the first liquidity pool in the new direction.
- **Invalid:** a body closes back through the breaker a second time — it has now failed twice. Drop it, don't keep re-marking it.
- **Best confluence:** a breaker or mitigation block that overlaps an FVG, or sits at the premium (for shorts) / discount (for longs) side of the current range.

## Common mistakes
- Calling every failed OB a "breaker" regardless of whether a sweep happened first — this conflates two different-strength signals into one, and leads to sizing a weak mitigation-block trade like a strong breaker trade.
- Trading a mitigation block as a standalone reversal setup instead of treating it as continuation-only.
- Re-entering a breaker that has already failed a second time, hoping it holds "this time."

## Further study
- [Day 12: Breaker Blocks & Mitigation Blocks Explained — ICT & SMC Deep Dive](https://tradingstrategyguides.com/day-12-breaker-blocks-mitigation-blocks-explained-ict-smc-deep-dive/)
- [ICT Mitigation Block Explained — Continuation Setup vs Breaker Block](https://innercircletrader.net/tutorials/ict-mitigation-block-explained/)
- [Breaker Block — Smart Money Concepts / ICT Concept, LuxAlgo Library](https://www.luxalgo.com/library/concept/breaker-block/)
- [ICT Mitigation vs Breaker Block: Entry Rules](https://fxnx.com/en/blog/ict-mitigation-vs-breaker-block-entry-rules)
