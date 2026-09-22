---
title: "Silver Bullet Model"
category: "Time & Session"
summary: "A time-boxed entry model restricted to three 1-hour windows a day. Liquidity sweep, FVG in the direction of bias, retrace entry. No FVG in the window, no trade."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "silver-bullet-model"
---

> **Key Point:** The Silver Bullet only exists inside its windows. Outside them, the same FVG-retrace logic is just a normal entry, not this model — don't log a 2:15pm trade as a Silver Bullet.

## What it is

The Silver Bullet is a time-boxed variant of the standard liquidity-sweep-then-FVG-retrace entry: instead of looking for the setup all day, you restrict yourself to three specific 1-hour windows where institutional displacement is statistically most likely, and you require a fresh FVG to have formed **inside** that window, in the direction of your higher-timeframe bias. If no qualifying FVG forms in the window, there is no trade — you do not extend the search past the hour.

## The three windows (NY time)

| Window | Session | Notes |
| --- | --- | --- |
| 03:00-04:00 | London open | Overlaps London's own manipulation leg; lower liquidity on US-listed futures, use with caution on MNQ/MES. |
| 10:00-11:00 | NY AM | The most-traded window: NY has been open 30-90 minutes, initial 9:30 volatility has settled, and this overlaps the "10am Powell" 4H-candle open (see that doc). |
| 14:00-15:00 | NY PM | Post-lunch, pre-close positioning; overlaps FOMC statement time (2:00pm ET) on FOMC days specifically — treat those days as high-impact news, not a routine Silver Bullet. |

The 10:00-11:00 window is the default for index futures because it stacks with the highest concentration of scheduled data and the 4H-candle open — three separate reasons for displacement lining up in the same hour.

## Mechanics

1. **Before the window:** know your bias (Daily Prep) and identify the nearest untaken liquidity level (recent swing high/low, session high/low) the window could plausibly sweep.
2. **Inside the window:** wait for price to take that liquidity level — a sweep, not just an approach.
3. **Confirmation:** the sweep must be followed by an MSS with real displacement in the direction of bias, leaving a fresh FVG. A sweep with no displacement afterward is not a Silver Bullet — it might just be continued manipulation.
4. **Entry:** on the retrace into that fresh FVG, ideally its 50% (consequent encroachment). Never chase the displacement leg itself.
5. **Stop:** beyond the sweep extreme.
6. **Target:** the next untaken liquidity pool in the direction of the move — often the session or daily high/low.
7. **Hard cutoff:** if the window closes (11:00, 04:00, or 15:00) before you get a valid FVG retrace, the setup is void for the day. Waiting past the window turns this into a different (undefined) trade.

## Worked example (MNQ, 10:00-11:00 window)

Bias: bullish. At 10:12 price sweeps the 09:47 swing low at 19,801.50, then reverses with an MSS through the 10:05 high, leaving an FVG at 19,812.00-19,818.50. At 10:24 price retraces to the FVG's 50% (19,815.25). Entry long there, stop at 19,799.00 (below the sweep, +buffer) = 16.25 points. Target the session high at 19,846.00 = ~30.75 points, ~1.9R. The whole setup completed at 10:24, well inside the window.

## Common mistakes

- **Forcing a trade because "it's Silver Bullet time."** The window is a filter, not a guarantee — most days it produces nothing tradeable, and that's the model working correctly.
- **Trading the sweep itself.** The sweep is the liquidity grab (manipulation); the entry is the retrace into the FVG left by the *reversal*, which is a separate, later event.
- **No bias filter.** An FVG against your daily bias inside the window is not a valid Silver Bullet — it's a counter-trend trade wearing a Silver Bullet costume.
- **Extending the window.** A retrace that finally taps the FVG at 11:04 is not a Silver Bullet trade anymore; if you take it, log it under whatever model it actually is.

![Diagram: Silver Bullet windows on the NY timeline, with the 10-11am window detailed](/theory/diagrams/silver-bullet-model.svg)

## My exact rules (fill in)

- **Window(s) I actually trade:**
- **Minimum FVG size (points/ticks):**
- **Confirmation timeframe (1m/3m/5m):**
- **Max stop distance before I skip:**
- **What counts as "the nearest liquidity level" for me:**
- **Max attempts per window:** 1

## Further study

- [CME Group Micro E-mini Nasdaq-100 contract specs](https://www.cmegroup.com/markets/equities/nasdaq/micro-e-mini-nasdaq-100.contractSpecs.html) — confirm actual trading hours around the London-open window on your instrument before relying on the 03:00-04:00 slot.
- [FRED Economic Release Calendar](https://fred.stlouisfed.org/releases/calendar) — check what's scheduled inside your chosen window before trading it; a Silver Bullet on FOMC day is a different, higher-risk trade.
