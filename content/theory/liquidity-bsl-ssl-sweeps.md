---
title: "Liquidity: BSL, SSL, Sweeps"
category: "Liquidity"
summary: "Where resting stops sit, how price targets them, how to tell a sweep from a real break, and how to use liquidity as target and trigger."
use_for: ["Daily Bias", "Targeting", "Confirmation"]
priority: "Core"
slug: "liquidity-bsl-ssl-sweeps"
---

> **Key Point:** Price moves from liquidity to liquidity. Every trade in this journal needs a liquidity level as its trigger (what got swept) and a liquidity level as its target (what's next).

## Why liquidity exists as a concept

Large orders can't simply hit the market bid or offer without moving price against themselves — there isn't enough resting size at any one price to fill a big position without slippage. Retail stop-loss orders and breakout entries cluster in predictable places: just beyond swing highs/lows, just beyond equal highs/lows, just beyond the previous day's or week's high/low. Those clusters are liquidity pools. Reading where they sit — and watching price get engineered into them before it reverses — is the core skill this doc teaches.

## Pools

- **BSL (buy-side liquidity):** sits **above** swing highs, equal highs (EQH), the prior day's high (PDH), the prior week's high (PWH), session highs, and trendline highs. It's made up of short-sellers' stop-losses and breakout buyers' entry orders.
- **SSL (sell-side liquidity):** sits **below** swing lows, equal lows (EQL), PDL, PWL, and session lows — long stop-losses and breakout sellers' entries.
- **Equal highs / equal lows (EQH/EQL):** when price taps the same level two or more times without breaking it, that's not "resistance holding" — it's liquidity building. The more touches, the bigger the resting cluster, and the more likely the algorithm engineers a run at it before reversing. Treat EQH/EQL as **targets**, never as support/resistance to fade.

## Ranking — strongest pools first

1. Weekly / monthly highs and lows.
2. PDH / PDL, previous session highs and lows.
3. Equal highs / equal lows (especially with 3+ touches).
4. Recent swing highs and lows on the entry timeframe.

Higher-ranked pools are more likely to be the actual draw for the day — cross-check against Daily Bias before assuming a nearby minor swing is "the" target.

## Sweep vs. run — the distinction that matters most

| Behavior | Read | Trade |
| --- | --- | --- |
| Wick through the level, body closes back inside | **Sweep (raid).** Stops were taken; the move was about liquidity, not direction. Reversal likely. | Wait for MSS, enter the retrace, target the opposite pool. |
| Body closes beyond and holds, ideally with displacement | **Run (acceptance).** The level didn't hold; price genuinely wants to trade through it. Continuation. | Enter the pullback in the trend direction, target the next pool. |

The tell isn't just wick-vs-body — it's what happens in the one to three candles *after* the level is taken. A sweep typically snaps back fast (within 1-3 candles on your entry timeframe) with visible rejection. A run keeps grinding, often with the next candle opening beyond the level rather than back inside it. If you're unsure which you're looking at, wait one more candle rather than guessing.

## Worked example

MNQ prints two equal highs at 20,150 (touches at 9:41 and 10:03 ET) — that's BSL building. At 10:12, a news-driven spike wicks to 20,168 and closes back at 20,141 within the same one-minute candle: a sweep. The next two candles show rejection (lower highs, a bearish MSS through the prior swing low). That's the trigger for a short, stop above 20,168 (the sweep extreme), target the next SSL pool — say the overnight low at 20,080. Contrast: if instead the 10:12 candle had closed at 20,161 and the next candle opened at 20,165 and kept climbing, that's a run — the correct read is a long pullback entry, not a short.

![Diagram: buy-side liquidity above equal highs, contrasting a wick sweep that reverses against a body-close run that continues](/theory/diagrams/liquidity-bsl-ssl-sweeps.svg)

## Turtle Soup — a named sweep pattern

"Turtle soup" is ICT's name for a sweep of an old, well-defined high or low (often several days or weeks old, not just the most recent swing) that immediately reverses. Mechanically it's the same sweep-then-MSS logic on this page, just applied to a more significant, older level with more resting size behind it. This app tracks it as its own model (**Double Sweep** in the journal's Model field) because it deserves its own checklist and rule set — see [Double Sweep (Turtle Soup)](/theory/double-sweep-turtle-soup) for the dedicated entry mechanics, stop placement, and worked example.

## Rules

- Equal highs/lows are targets, not resistance/support. Expect them to be taken before any reversal.
- The more touches on a level, the more stops are resting there, and the more likely — eventually — a sweep occurs.
- A sweep with a fast MSS and a clean FVG left behind is an A-grade trigger. A sweep followed by a slow grind back toward the level is not tradeable yet — wait.
- Target the **first** untouched pool in the trade direction. Only move to the next pool after that if you've already taken partials.
- "Draw on liquidity" is the day's core decision: price is heading toward whichever pool is closest and least defended by opposing structure — this is what Daily Bias prep is trying to identify before the session opens.
- Don't manufacture a liquidity story after the fact to justify a trade you already wanted to take. If you can't point to the specific pool before entry, it's not a liquidity-based trade.

## Common mistakes

- **Fading equal highs/lows as resistance.** They are targets. Fading them without a confirmed sweep + MSS is trading against the very thing that's about to happen.
- **Entering on the wick itself.** The sweep is confirmation a reversal *might* be starting, not the entry. Wait for MSS and a PD array to form.
- **Ranking a random nearby swing above a real PDH/PDL.** Bigger-timeframe pools usually win when they're both in play — check the ranking list above before picking a target.

## Further study

- [The Inner Circle Traders — What Is Liquidity in ICT Trading?](https://www.theinnercircletraders.com/ict-what-is-liquidity-in-trading/) — BSL/SSL and engineered liquidity explained.
- [LuxAlgo — Liquidity Sweep: Smart Money Concepts / ICT Concept](https://www.luxalgo.com/library/concept/liquidity-sweep/) — sweep vs. breakout distinction with chart examples.
