---
title: "AMD / Power of 3"
category: "Framework"
summary: "Accumulation, Manipulation, Distribution: the three-phase daily/session/candle template. Manipulation is the false move that raids liquidity before the real move."
use_for: ["Daily Bias", "Entry Model"]
priority: "Core"
slug: "amd-power-of-3"
---

> **Key Point:** Every candle and every day has an open, a false move against the intended direction, then the real move. Trade the reversal after the false move, not the false move.

## The core idea

Power of 3 (PO3) says that price delivery over any range — a candle, a session, a day, a week — is not random. It moves through three phases: it first **accumulates** (builds a range, resting orders on both sides), then **manipulates** (a deliberate false move that raids one side of that range to fill the size institutions need), then **distributes** (the real, intended move, away from the manipulation). The name comes directly from this three-step delivery cycle, and every phase exists to serve the next one — accumulation builds the liquidity manipulation needs to raid, and manipulation creates the fuel (trapped opposite-side traders, filled stops) that distribution runs on.

## Phases

| Phase | What price does | Typical timing (ET) |
| --- | --- | --- |
| Accumulation | Tight range, orders build on both sides, liquidity forms above and below | Asia (20:00 to 00:00) |
| Manipulation | Fast move against the true direction that raids one side of the range (Judas swing) | London open (02:00 to 05:00) or NY open (08:30 to 09:30) |
| Distribution | Displacement in the true direction toward the draw on liquidity | NY AM (08:30 to 11:00), sometimes London |

## Why manipulation has to happen first

Institutional-size orders cannot fill inside a tight, low-volume accumulation range without moving price against themselves. The manipulation leg exists to source the other side of that size: a sharp push through a visible liquidity pool (equal highs/lows, session high/low, prior day's high/low) fills large buy or sell orders against the stops and breakout entries resting there. Once that liquidity is taken, the real move — distribution — has both the order flow and the trapped counter-positioned traders (whose stops just added fuel) to run cleanly in the intended direction. This is why manipulation is *always* the false move: if the raid were the real move, there would be no one left on the wrong side to fuel distribution.

## Bullish template
1. Range forms (accumulation).
2. Price trades **below** the open and sweeps sell-side (SSL, range low, session low) — this is the manipulation leg.
3. MSS up with displacement, FVG left behind — this confirms distribution has started.
4. Enter on retrace into FVG / OB / OTE.
5. Target: range high, PDH, next BSL.

## Bearish template
1. Range forms.
2. Price trades **above** the open and sweeps buy-side.
3. MSS down with displacement, FVG left behind.
4. Enter on retrace into FVG / OB / OTE.
5. Target: range low, PDL, next SSL.

## Reading the phase live

You rarely know which phase you're in from a single candle — you infer it from context:

- **Still in accumulation** if price has been ranging for a while inside a defined band with no directional break, and volume/range per candle is compressed.
- **In manipulation** if price just took a defined liquidity level with a sharp, often single-candle move, and hasn't confirmed with an MSS yet. This is the phase to *watch*, not trade.
- **In distribution** once an MSS with real displacement (a strong-bodied candle that breaks the most recent swing structure) has printed after the manipulation leg. This is the phase to trade — entries are retraces into what distribution left behind (FVG/OB), not the initial displacement candle itself.

## Worked example — a full NY day

**20:00-00:00 ET (Asia):** MNQ ranges 19,780-19,820, no directional bias yet — accumulation.

**02:00-05:00 ET (London):** price pushes down to 19,762, sweeping the Asia low and the prior day's low — manipulation, bearish-looking, but no MSS up yet.

**08:30-09:30 ET (NY open):** price reclaims 19,820 and prints an MSS up through the last London swing high with a strong-bodied candle, leaving an FVG at 19,808-19,815 — distribution has begun, bias flips bullish for the day.

**09:45 ET:** price retraces into the 19,808-19,815 FVG. Entry long here, stop below the 19,762 manipulation low (or a tighter stop below the FVG if using a defined-risk model), target the Asia range high (19,820) then the prior day's high.

This is the same fractal whether you're reading Asia/London/NY on the daily chart, or a 15-minute range inside a single killzone — the roles (accumulation, manipulation, distribution) don't change, only the timeframe does.

## The fractal nature

The same A-M-D shape repeats at every timeframe simultaneously, nested inside itself:

- **Weekly:** Monday-Tuesday often accumulate/manipulate, Wednesday-Thursday distribute, Friday consolidates or continues.
- **Daily:** Asia accumulates, London manipulates, NY distributes (the classic profile above).
- **Session:** inside NY AM alone, the first 30-45 minutes can accumulate, a news candle or the 10:00 open manipulates, the next hour distributes.
- **Single candle / 15m:** even one candle's open-to-close path often shows a small wick-based "manipulation" before the body commits to a direction — this is the same logic at the smallest scale ICT teaches with.

Because it's fractal, you should always ask "AMD of what range, on what timeframe?" before acting — a manipulation leg on the 15m chart can simply be *part of* the accumulation phase on the 4H chart.

![Diagram: AMD / Power of 3 fractal — Accumulation, Manipulation, Distribution across a session](/theory/diagrams/amd-power-of-3.svg)

## Rules
- The manipulation leg must take a **defined** liquidity level. No level taken, no manipulation.
- Confirmation is the MSS with displacement. A sweep alone is not an entry.
- Manipulation direction is opposite to bias. If you are bullish, expect the dip first.
- Fractal: same pattern on Weekly (Mon-Tue manipulation, Wed-Thu distribution), Daily, session, hourly, and 15m.
- Continuation days exist: no clean reversal, price just runs from the open. If there is no sweep by your entry window, the AMD read is wrong, stand down.

## Profiles to tag in Daily Prep
- **Classic:** Asia range, London Judas, NY distribution.
- **Continuation:** London sets direction, NY continues.
- **Reversal of prior day:** NY reverses London's move.
- **Consolidation:** no clean phases, chop. Skip.

## Further study

- [CME Group: Introduction to futures trading sessions](https://www.cmegroup.com/education.html) — official session/hours reference to cross-check Asia/London/NY windows against your instrument's actual trading hours.
- [CFTC: Understanding the Futures Markets](https://www.cftc.gov/LearnAndProtect/EducationCenter/index.htm) — regulator-level background on how futures liquidity and order flow actually work.
