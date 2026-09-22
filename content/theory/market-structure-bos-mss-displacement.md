---
title: "Market Structure: BOS, MSS, Displacement"
category: "Structure"
summary: "Swing definition, break of structure vs market structure shift, displacement rules. Structure decides trend and confirms entries."
use_for: ["Confirmation", "Invalidation", "Entry Model"]
priority: "Core"
slug: "market-structure-bos-mss-displacement"
---

> **Key Point:** A break only counts if it has displacement. A wick through a level is a sweep, not a break. Structure is the skeleton every other concept in this library hangs on — get this wrong and FVGs, order blocks, and liquidity targets all point the wrong way.

## Why structure comes first

Every ICT/SMC entry model in this library — 10am Powell, Silver Bullet, Double Sweep, the standard liquidity-sweep-and-MSS entry — needs the same two ingredients: a liquidity sweep, and a structural break that confirms the reversal or continuation. Structure is what tells you whether you're looking at "price paused" or "price turned." Everything downstream (which FVG matters, which order block is valid, where the stop goes) is read relative to the last confirmed structural point.

## Definitions

- **Swing high:** a candle whose high is higher than the candle immediately before and after it (a "fractal" — lower high on each side).
- **Swing low:** a candle whose low is lower than the candle immediately before and after it (higher low on each side).
- **Structural order:** a swing that itself sits between two lower-order swings is the next order up (e.g. a 1-minute swing high that is also the highest point of a 5-minute leg is a 5-minute swing high). Use the order that matches your entry timeframe — day-trading MNQ off the 5m for structure and 1m for entry is a common split in this app's Daily Bias process.
- **Bullish structure:** a sequence of higher highs (HH) and higher lows (HL). **Bearish structure:** lower lows (LL) and lower highs (LH).
- **Protected swing:** the most recent swing low (in an uptrend) or swing high (in a downtrend) that structure depends on. Structure is intact until price body-closes beyond it.

## Breaks — the three you must tell apart

| Term | Rule | Meaning |
| --- | --- | --- |
| **BOS** (break of structure) | Body closes beyond the last swing **in the trend direction** | Continuation. Look for a pullback entry into the leg that produced the break. |
| **CHoCH** (change of character) | Body closes beyond the most recent counter-trend swing, against the prevailing trend — the *first* sign of a possible reversal | Early warning only. Not yet confirmed — needs displacement to become an MSS. |
| **MSS** (market structure shift) | Body closes beyond the swing that produced the last extreme, against trend, **with displacement** | Confirmed reversal. Look for a retrace entry into the FVG/OB it leaves behind. |
| **Sweep** | Wick beyond a level, body closes back inside | Liquidity taken, not a structure break at all — see [Liquidity: BSL, SSL, Sweeps](/theory/liquidity-bsl-ssl-sweeps). |

Terminology varies by source: some traders use CHoCH and MSS interchangeably (any counter-trend break against the prior swing); ICT-style usage as followed in this library treats **CHoCH as the tentative first break** and **MSS as that same break confirmed by displacement**. In practice, only trade the MSS version — a CHoCH without displacement is noise more often than not.

## Displacement — the part beginners skip

Displacement is a strong, one-directional move with large bodies and small wicks that leaves an FVG behind it. It's the market's "tell" that real institutional order flow is behind the move, not a slow grind. Three tests:

1. **Range expansion** — the candle(s) range is visibly larger than the recent average, not just a marginally bigger bar.
2. **Body dominance** — the body is most of the candle; wicks are small relative to the body.
3. **A gap is left** — the move is fast enough that a 3-candle Fair Value Gap forms in its wake (see [Fair Value Gap (FVG) & IFVG](/theory/fair-value-gap-fvg-ifvg)).

Without all three, treat the break as a plain BOS/CHoCH with no displacement — lower conviction, and not enough on its own to flip your bias.

## Worked example

Say MNQ has been grinding up: swing low at 19,850 (HL), rallies to a swing high at 19,940 (HH) — that's a BOS confirming the uptrend if it closes above the prior high of 19,920. Price pulls back to a higher low at 19,890, pushes to a new high at 19,970 (another BOS, uptrend intact). Then a fast three-candle sell-off closes at 19,860 — **below the protected low of 19,890** — with visibly larger bodies and a clean FVG left between the first and third candle. That close is the MSS: structure has shifted bearish. The retrace back up into that FVG (roughly 19,880–19,895) is the entry, stop above the 19,970 high (or above the FVG, depending on your exact rules), target the next sell-side liquidity pool below.

![Diagram: market structure sequence showing a BOS continuing an uptrend, then an MSS with displacement and FVG reversing it](/theory/diagrams/market-structure-bos-mss-displacement.svg)

## Entry flow

1. Liquidity sweep (see Liquidity doc) — price runs stops beyond a defined pool.
2. MSS with displacement, closing beyond the protected swing.
3. Retrace into the FVG / order block / OTE zone left by the displacement leg.
4. Stop beyond the sweep extreme. Target the next liquidity pool.

## Rules

- Higher-timeframe structure sets direction. Lower-timeframe MSS times the entry — don't fight the higher-timeframe trend without a very good reason.
- An MSS with no prior liquidity sweep is lower grade — it's more likely to be noise than an engineered reversal.
- Internal structure (inside the current leg, smaller swings) confirms entry timing. External structure (the range extremes, the swings that define the leg itself) defines your targets.
- Structure is invalid the instant price body-closes beyond the last protected swing — not on a wick, not on "it looks like it's about to."
- Don't redraw swing points after the fact to make a losing read look right. Mark them live, journal what you actually saw.

## Common mistakes

- **Counting a wick as a break.** A wick beyond a swing without a body close is a sweep, not structure — see the Liquidity doc for how to trade that correctly instead.
- **Trading every CHoCH.** A CHoCH without displacement is a coin flip. Wait for the MSS.
- **Mixing timeframes mid-analysis.** Pick your structure timeframe and your entry timeframe before the session starts (this is part of Daily Bias prep), not after price has already moved.
- **Ignoring displacement entirely and calling any big red candle an MSS.** Check for the FVG — if there's no gap, conviction is lower.

## Further study

- [LuxAlgo — Market Structure Shifts (MSS) in ICT Trading](https://www.luxalgo.com/blog/market-structure-shifts-mss-in-ict-trading/) — clear breakdown of BOS vs CHoCH vs MSS terminology.
- [CME Group — Micro E-mini Futures Products Overview](https://www.cmegroup.com/education/courses/micro-e-mini-futures/micro-e-mini-futures-products-overview) — official contract context for the index futures this structure logic is applied to in this journal.
