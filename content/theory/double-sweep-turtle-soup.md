---
title: "Double Sweep (Turtle Soup)"
category: "Liquidity"
summary: "A failed breakout that gets swept twice before reversing. The second, deeper raid traps traders who faded the first one early — that's the real entry signal."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "double-sweep-turtle-soup"
---

> **Key Point:** One sweep can just be noise. A second, deeper sweep of the same liquidity — after the first one already failed to hold — is a much stronger tell that the level is now exhausted.

## What it is

"Turtle Soup" is the original name (from Linda Raschke, adopted into ICT teaching) for fading a failed breakout: price pushes past a well-known prior high or low, triggers the stops and breakout entries resting there, then fails to continue and reverses back through the level. **Double Sweep** is the same idea but requires two distinct raids of the same liquidity pool before you act — the first sweep fails to hold (a premature bounce that isn't the real reversal), price pushes through again to a slightly deeper extreme, and *that* second raid is what actually exhausts the level and produces the real reversal. This is a different, related model from [Liquidity: BSL/SSL Sweeps](/theory) (a single sweep followed by an MSS) — Double Sweep specifically waits for the level to be tested twice.

## Why the second sweep matters

A single sweep can be genuine continuation in disguise — price takes the level and simply keeps going, especially in a trending market. Requiring a second, deeper raid filters that out: anyone who tried to fade the first sweep already got stopped out or is now trapped on the wrong side when price pushes further. That second group's stops (plus fresh breakout entries chasing the new extreme) become the exact fuel the real reversal runs on. In practice this means Double Sweep entries tend to have a cleaner reversal candle and a more reliable MSS than a single, un-retested sweep.

## Mechanics

1. **Identify the level:** a clear prior swing high/low, equal highs/lows, or session extreme with resting liquidity.
2. **Sweep #1:** price trades through the level, then bounces/dips back — but without a real MSS or displacement confirming reversal. Do not enter here; this is bait.
3. **Sweep #2:** price returns and pushes to a new, deeper extreme beyond sweep #1. This is the raid that matters.
4. **Confirmation:** an MSS with displacement back through the range, leaving an FVG or OB.
5. **Entry:** retrace into that FVG/OB.
6. **Stop:** beyond sweep #2's extreme (not sweep #1's — that level is already invalidated by definition).
7. **Target:** opposite side of the range, or the next untaken liquidity pool.

## Worked example (MES)

Prior session low: 5,912.25. At 09:41, price wicks to 5,910.75 (sweep #1) and bounces to 5,915.00 — no MSS, no displacement, just a bounce. At 09:58, price returns and pushes to 5,908.00 (sweep #2, deeper than sweep #1), then reverses hard with a strong-bodied candle back through 5,913.00, leaving an FVG at 5,913.50-5,916.00. Entry long on the retrace to 5,914.75, stop at 5,907.00 (below sweep #2, +buffer) = 7.75 points. Target the prior session high.

## Double Sweep vs. single-sweep Turtle Soup

| | Single sweep (Turtle Soup) | Double Sweep |
| --- | --- | --- |
| Raids required | One | Two, second deeper than first |
| Speed | Faster — can enter right after the first reversal | Slower — waits for the retest/second raid |
| Reliability | Lower — can be a genuine breakout in disguise | Higher — the failed first attempt filters out real continuation |
| Best used when | Level is fresh, hasn't been tested recently | Level has already produced one failed reversal attempt intraday |

## Common mistakes

- **Entering on sweep #1.** That's exactly the trap this model is designed to avoid — the first raid is bait, not the signal.
- **Using sweep #1's extreme as the stop.** Sweep #2 invalidates it; your risk reference is always the most recent (deepest) raid.
- **Forcing a "second sweep" that's really just noise inside the same wick.** The two raids need to be genuinely distinct attempts (separate candles/legs with a bounce in between), not one messy wick.

![Diagram: double sweep — first raid fails to hold, second deeper raid traps late fades, then the real reversal](/theory/diagrams/double-sweep-turtle-soup.svg)

## My exact rules (fill in)

- **Minimum distance between sweep #1 and sweep #2 (points/time):**
- **Confirmation timeframe:**
- **Max stop distance before I skip:**
- **Instruments I trade this on:**
- **Max attempts per level per day:** 1

## Further study

- [CME Group Micro E-mini S&P 500 contract specs](https://www.cmegroup.com/markets/equities/sp/micro-e-mini-sandp-500.contractSpecs.html) — tick size and session hours reference if trading this on MES/ES.
- [CFTC: Understanding the Futures Markets](https://www.cftc.gov/LearnAndProtect/EducationCenter/index.htm) — regulator background on stop-order clustering and liquidity, the mechanism this model exploits.
