---
title: "SMT Divergence"
category: "Liquidity"
summary: "Correlated instruments failing to confirm each other at a key level. Use as confirmation of a sweep and reversal, never as a standalone trigger."
use_for: ["Confirmation", "Invalidation"]
priority: "Secondary"
slug: "smt-divergence"
---

> **Key Point:** When correlated markets disagree at a liquidity level, the one that *fails* to take the level is showing the true strength or weakness. SMT is confirmation, never a trigger by itself.

## What it is

SMT (Smart Money Technique / "smart money divergence") is a non-confirmation between two correlated instruments at matching swing points. Genuine broad institutional participation should show up across a whole correlated complex at once — if only one instrument makes the new extreme while its correlated partner refuses to, that lopsided move looks less like real conviction and more like a targeted run on resting stops in just the one instrument. ICT introduced the ES/NQ version of this in 2022 specifically because the two indices are tightly correlated and trade nearly identical hours, which makes divergence easy to spot cleanly.

## Bearish SMT (at highs)

- Instrument A makes a new high, taking out buy-side liquidity.
- Instrument B fails to make its own corresponding new high — it stalls below its prior high.
- Read: the instrument that failed is showing real seller strength. Once the leader (A) shows an MSS down, that's the confirmation to look for shorts in both, or in whichever you trade.

## Bullish SMT (at lows)

- Instrument A makes a new low, taking out sell-side liquidity.
- Instrument B holds a higher low and does not confirm.
- Read: look for longs once the leader shows an MSS up.

## This app's context: NQ/MNQ vs ES/MES

For a trader logging MNQ and MES trades in this journal, **NQ vs ES is the primary SMT pair** — same US cash session, same macro drivers (rates, Fed policy, mega-cap tech sentiment bleeding into the broader index), and the tightest practical correlation of any two liquid index futures. In practice:

- Watch the **same swing level on the same timeframe** for both — a 5-minute swing high on NQ against a 5-minute swing high on ES, not a 5-minute high on one against a 1-minute high on the other.
- NQ tends to be the higher-beta, more volatile leg (bigger swings, more prone to sweeping liquidity first); ES tends to be the "confirming" instrument that shows whether the move has broad support.
- If you trade MNQ, you can still use ES/MES purely as a **confirmation chart** even if you never place a trade on it.

## Beyond NQ/ES

- **YM (Dow)** — a third equity index leg. Useful as a tie-breaker when NQ and ES briefly disagree, or when tech-heavy NQ is being distorted by a single mega-cap name's earnings/news.
- **RTY (Russell 2000)** — small-caps behave differently enough (higher beta to risk sentiment broadly, less mega-cap tech influence) that RTY divergence from NQ/ES can flag a *sentiment* shift rather than a purely index-specific one.
- **Cross-asset SMT with Gold (GC) and DXY** — Gold and the US Dollar Index are typically inversely correlated with risk assets. A DXY/Gold divergence at a key level around the same time as an equity-index SMT is a broader macro-confirmation signal, but treat it as a secondary layer — cross-asset correlation is looser and drifts more than NQ/ES.
- Crypto (BTC/ETH) can show SMT against each other in the same way, for sessions where they're actively trending together.

## Worked example

At 10:00 ET, both NQ and ES sweep their respective overnight highs. NQ prints a clean new high on the 5-minute chart at 20,210 (prior high 20,195). ES, checked on the same 5-minute chart at the same two candles, stalls at its prior high and does **not** print a new one. That's a bearish SMT. You wait — SMT alone is not the trigger. Two candles later, NQ shows an MSS down through its own recent higher low with displacement. That MSS, confirmed by the prior SMT, is the actual entry signal for a short on MNQ; stop above the NQ sweep high, target the next SSL pool.

![Diagram: two correlated charts where one instrument prints a new high and the other fails to confirm it, flagging bearish SMT](/theory/diagrams/smt-divergence.svg)

## Rules

- Only count SMT at a **defined liquidity level** — session high/low, PDH/PDL, or equal highs/lows. Random minor wiggles on two charts don't count.
- SMT is confirmation, never the trigger by itself. You still need an MSS and a PD array entry (FVG/OB/OTE) before you're in a trade.
- Check both instruments on the **same timeframe**, at the **same level in time** — comparing a 1-minute high on one against a 5-minute high on the other invalidates the read.
- If price then body-closes cleanly through the level on *both* instruments, the divergence is invalidated — that's a run, not a reversal setup.
- Don't force SMT onto a chart that doesn't clearly show it. If it's ambiguous, skip that confirmation layer and rely on structure + liquidity alone.

## Common mistakes

- **Using SMT as a standalone entry signal.** It flags where to pay closer attention, not where to click buy/sell.
- **Comparing mismatched timeframes or mismatched moments in time.** Pull up both charts side by side before calling a divergence.
- **Ignoring invalidation.** If the "failed" instrument later closes through the level too, the SMT read was wrong — don't hold a trade that was based on it.

## Further study

- [LuxAlgo — Smart Money Technique Divergence](https://www.luxalgo.com/library/concept/smart-money-technique-divergence/) — SMT definition with NQ/ES chart examples.
- [CME Group — Micro E-mini Equity Index Futures](https://www.cmegroup.com/markets/equities.html) — official specs for the correlated index futures referenced above (NQ/MNQ, ES/MES, YM, RTY).
