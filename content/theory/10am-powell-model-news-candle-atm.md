---
title: "10am Powell Model (News Candle + ATM)"
category: "Framework"
summary: "News-candle entry model around the 10:00 ET release/4H-candle window, run through a fixed ATM bracket. Includes a blank rule block to lock in your exact mechanics."
use_for: ["Entry Model", "Targeting"]
priority: "Core"
slug: "10am-powell-model-news-candle-atm"
---

> **Warning:** The framework below is the general news-candle logic. Fill in the **My exact rules** block with your own mechanical entry, so this page matches what you actually trade.

## Where the name comes from

"Powell" here is a nickname, not literally a Fed-chair speech. Retail ICT-style traders call the 10:00 ET open the **"Powell" open** because it anchors a new 4-hour candle (10:00-14:00 ET) inside the daily AMD cycle, and because it so often coincides with a scheduled data release that moves price right as that 4H candle opens. Two separate things stack at 10:00 ET and this model trades the overlap:

1. **The 4H candle open itself.** New 4H candles tend to sweep the immediately prior range before committing to a direction — this happens with or without news.
2. **The 10:00 ET data slot.** ISM Manufacturing/Services PMI, JOLTS, Consumer Confidence, New/Existing Home Sales, and Richmond Fed all release at 10:00 ET on their respective days. The nickname stuck from the years Jerome Powell chaired the Fed and regularly moved markets around this window; FOMC statements do **not** land at 10:00 ET (2:00 PM ET) and the sitting chair's post-meeting press conference is 2:30 PM ET — don't confuse this model with FOMC day, which needs its own plan (see [High-Impact News Playbook](/theory)).

## Why 10:00 ET specifically

By 10:00 the cash session is 30 minutes old: the opening-range liquidity from 9:30 is already resting above/below the first swing, and the 9:30-10:00 range gives you a clean pre-news reference. A release (or just the raw 4H-candle open) then does one of two things: sweeps one side of that range and reverses (manipulation), or displaces straight through it and holds (continuation). Your job is to read which one happened *after* the fact — never predict it.

## Model logic

1. **Pre-news:** mark the 9:30-10:00 range (high/low), the session high/low, and the nearest FVG/OB. Note today's bias from Daily Prep — this model should trade *with* bias, not against it.
2. **News candle:** the 1m/5m candle that opens at 10:00. Record its **open**, high and low precisely; these three prices are your reference lines for the rest of the setup.
3. **Reaction — manipulation vs. displacement:**
   - **Manipulation:** the candle (or the next 1-2 candles) sweeps the pre-news range high or low, then closes back inside the range. This is the spike you fade.
   - **Displacement:** price closes beyond the range with real body, no immediate reversal, often gapping through the nearest FVG. This is not this model's setup — don't force a reversal trade into a real displacement.
4. **Entry:** on a retrace to the news-candle open, a rejection block, or an FVG formed by the reversal leg. Direction follows the side that got swept (swept the high -> look for shorts; swept the low -> look for longs) and must agree with daily bias.
5. **Stop:** beyond the news-candle extreme (the spike wick), not beyond the whole reaction leg — if your stop distance blows past your cap, skip the trade rather than resize the stop.
6. **Target:** opposite side of the pre-news range first, then the next untouched liquidity pool (prior session high/low, unfilled FVG, NDOG).

## Worked example (MNQ)

Pre-news range: high 19,842.00, low 19,808.00 (9:30-10:00). At 10:00 the news candle spikes to 19,861.50 (sweeping the 9:52 high at 19,855.00 too) on an ISM Services miss, then closes back at 19,831.00 — a clean manipulation candle. Price retraces to 19,838.00 where the reversal leg left a small FVG. Entry short at 19,838.00, stop at 19,863.00 (above the 19,861.50 spike, +1 tick buffer) = 25-point stop. Target 1 at the range low (19,808.00) = 30 points, ~1.2R. Target 2 at the prior day's low if it's still open. On 2 MNQ contracts at USD 2/point, a 25-point stop is USD 100 risk before commissions — outside this model's default 10-20 point cap, so per the rule below this specific trade is skipped or halved to 1 contract.

## Common failure modes

- **Trading the displacement as if it were manipulation.** If the first 10:00 candle closes strong with a real body beyond the range and doesn't retrace, that's continuation — chasing a "reversal" here means shorting into a real breakout.
- **Using the wrong range.** The reference range is 9:30-10:00 only. Anchoring to the overnight range or the prior day's range produces a different (usually wrong) stop and target.
- **No bias filter.** This model without a directional bias just trades every 10:00 spike both ways — that's a coin flip with commissions attached, not an edge.
- **Widening the stop after the spike prints.** The spike wick is the stop. If price is already through where your stop "should" be before you can enter, the setup is gone — don't chase.

## ATM bracket (NinjaTrader Advanced Trade Management)

The ATM places stop and targets automatically at entry so the plan is fixed before emotion.

| Parameter | Your setting |
| --- | --- |
| Contracts | 2 MNQ |
| Stop | 10 to 20 points |
| Risk at 2 MNQ | USD 40 to 80 (2 contracts x USD 2/pt x 10 to 20 pts), before commissions and slippage |
| Frequency | About 2 to 3 setups per week |

![Diagram: 10am Powell model — pre-news range, manipulation spike, retrace entry, stop, and target](/theory/diagrams/10am-powell-model-news-candle-atm.svg)

## My exact rules (fill in)

- **Trigger event/time:**
- **Timeframe used for news candle:**
- **Entry level (open / 50% / edge / retest):**
- **Confirmation required:**
- **TP1 / TP2 in points:**
- **Break-even rule:**
- **Skip conditions (bias conflict, wide spike, etc.):**
- **Max attempts per event:** 1

## Rules

- If the news candle stop distance exceeds your 20-point cap, no trade.
- Never move the ATM stop wider.
- Only take the reversal read (manipulation), never chase a genuine displacement as if it were a fade.
- Log every attempt in Trade Journal with model = 10am Powell (ATM), including skipped setups in Lesson.

## Further study

- [Economic Release Calendar — FRED, St. Louis Fed](https://fred.stlouisfed.org/releases/calendar) — official US data release times, including the 10:00 ET slots this model trades around.
- [Federal Reserve speeches and press conference schedule](https://www.federalreserve.gov/newsevents/2026-speeches.htm) — confirm the sitting chair's actual speaking times before assuming a 10:00 ET overlap.
