---
title: "High-Impact News Playbook"
category: "Time & Session"
summary: "Release times, typical behavior, and the approach for CPI, NFP, FOMC, PPI and Fed speakers. Wait for sweep + MSS, never trade the print candle blind."
use_for: ["Daily Bias", "Entry Model", "Invalidation"]
priority: "Core"
slug: "high-impact-news-playbook"
---

> **Key Point:** News is a liquidity event, not a directional signal by itself. The first spike takes stops on both sides; the second, structural move is the tradable one.

## Why fade-the-print doesn't work

The print candle is driven by whichever resting orders and stops sit closest to price at the moment the number crosses the wire — it is not driven by whether the number was "good" or "bad" relative to forecast. That's why a beat-expectations NFP print can spike down before reversing, and a miss can spike up. ICT's approach treats the release the same way it treats any other liquidity event: the initial spike is assumed to be manipulation until proven otherwise by what happens in the minute or two after it. Waiting for a swept level plus MSS with displacement filters out the coin-flip reaction and only engages once real direction has confirmed.

## Calendar reference (ET)

| Event | Time | Notes |
| --- | --- | --- |
| CPI, PPI, NFP (Employment Situation), Jobless Claims, Retail Sales | 08:30 | Highest-impact scheduled releases. Land before the 9:30 cash open, inside the NY AM killzone. |
| JOLTS, ISM, Consumer Confidence, some Fed speakers | 10:00 | Mid-tier. Basis of the 10am Powell (ATM) model — see that doc for the entry mechanics. |
| FOMC statement | 14:00 | Major. Wide range and whipsaws as algos parse the statement text. |
| FOMC press conference | 14:30 | Second wave — the Chair's Q&A frequently reverses or extends the 14:00 reaction. |
| Fed chair testimony / other speeches | varies | Check the calendar the day before; these aren't on a fixed monthly schedule. |

Zurich time is ET plus 6 hours for most of the year (5 hours during the brief US/EU daylight-saving mismatch — see Sessions & Killzones for the detail).

## Event-specific notes

**CPI / PPI (8:30):** Usually the highest-volatility scheduled release outside of FOMC. Pre-news price action into the 8:20–8:30 window often tightens into a small range as market makers pull size ahead of the print — that compression itself is a tell that something is about to move.

**NFP (8:30, first Friday of the month):** Headline number, unemployment rate, and average hourly earnings can each pull in different directions inside the same release — read the full spike, not just the headline print, before assuming which way the "real" reaction is going.

**FOMC (14:00 statement / 14:30 press conference):** Treat these as two separate news events on the same day, not one. It's common for the 14:00 statement to spike one way and the 14:30 press conference Q&A to fully reverse it once the Chair's tone becomes clear — the tradable structural move is very often the second one, not the first.

**Fed speakers (varies):** Lower and more variable impact than scheduled data, but a hawkish or dovish surprise from an FOMC voting member can move futures meaningfully with no scheduled-release cushion beforehand. Check the day's calendar in Daily Prep so an unexpected spike doesn't get misread as a clean technical move.

## Approach

1. **Before:** mark the pre-news range, the session high/low, and the nearest OB/FVG. Set bias and skip conditions in Daily Prep.
2. **At release:** do not enter on the print candle itself — no exceptions, regardless of how obvious the direction looks in the first few seconds.
3. **First spike:** treat it as the manipulation. Wait for it to sweep a level (the pre-news range high/low, or the day's existing liquidity pool).
4. **Confirmation:** wait for MSS with displacement away from the swept level, leaving an FVG behind.
5. **Entry:** on the retrace into the FVG, a rejection block, or the news-candle open — whichever forms first and lines up with bias.
6. **Stop:** beyond the spike extreme. **Target:** the opposite side of the pre-news range, or the next real liquidity pool.

## Rules

- Spreads and slippage widen sharply in the first 1–2 minutes. Use limit entries where your platform allows it, and cut size if the resulting stop distance exceeds your normal cap.
- Confirm your account's rules explicitly allow news trading before relying on any of this — some prop-firm rule sets treat trading through news as a hard breach regardless of what the setup looked like.
- Skip the event entirely when the daily bias is Low confidence and the release is an 8:30 print, unless a specific model in this library explicitly covers that exact scenario (the 10am Powell model is the one exception built for a news window).
- Log the event, the surprise vs. forecast, and the actual reaction in Daily Prep — this is what calibrates your read on "which spike is the real one" over time.

## Further study

- [U.S. Bureau of Labor Statistics — CPI release schedule (official)](https://www.bls.gov/schedule/news_release/cpi.htm)
- [U.S. Bureau of Labor Statistics — Employment Situation (NFP) release schedule (official)](https://www.bls.gov/schedule/news_release/empsit.htm)
- [Federal Reserve — FOMC meeting calendars (official)](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm)

![Diagram: a news-release candle sequence showing the initial spike sweeping a level, MSS with displacement, and entry on the FVG retrace](/theory/diagrams/high-impact-news-playbook.svg)
