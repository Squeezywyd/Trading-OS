---
title: "Trading Other Futures: ES/MES, Gold, Crude, Russell"
category: "Framework"
summary: "How the ICT models in this library translate to ES/MES, Gold (GC/MGC), Crude Oil (CL/MCL), and Russell (RTY/M2K) — contract specs and what's different enough to trip up an MNQ trader."
use_for: ["Daily Bias", "Confirmation"]
priority: "Secondary"
slug: "trading-other-futures"
---

> **Key Point:** This doc is theory and context only — this app's Instrument field still tracks MNQ, NQ, MES, ES, ETH, or Other. Use this to understand what you're looking at when you check a correlated market or consider a different instrument, not to expand what the journal logs.

## Why this matters even if you only trade MNQ

Every entry model in this library (AMD, liquidity sweeps, FVG/OB, killzones, SMT) was written around index futures. They generalize to other futures markets reasonably well because the underlying idea — engineered liquidity, displacement, price delivery through PD arrays — isn't specific to equities. But each market has a different personality: different scheduled-news triggers, different session emphasis, different volatility drivers. Trading MNQ habits onto crude oil without adjusting will get your stop run by a report you didn't know existed.

## Contract specs at a glance

| Instrument | Ticker (standard / micro) | Multiplier | Tick size | Tick value | Point value |
| --- | --- | --- | --- | --- | --- |
| Nasdaq-100 | NQ / MNQ | $20 / $2 | 0.25 | $5.00 / $0.50 | $20 / $2 |
| S&P 500 | ES / MES | $50 / $5 | 0.25 | $12.50 / $1.25 | $50 / $5 |
| Gold | GC / MGC | $100 / $10 (per oz, 100oz / 10oz) | $0.10 | $10.00 / $1.00 | $100 / $10 |
| Crude Oil (WTI) | CL / MCL | $1,000 / $100 (1,000bbl / 100bbl) | $0.01 | $10.00 / $1.00 | $1,000 / $100 |
| Russell 2000 | RTY / M2K | $50 / $5 | 0.10 | $5.00 / $0.50 | $50 / $5 |

NQ/MNQ and ES/MES rows are this app's `CONTRACT_POINT_VALUES` — the other three are for reference; verify current specs on CME Group before sizing any real position, as exchanges revise tick sizes and margins periodically.

## ES / MES — the closest cousin to NQ

ES tracks the S&P 500 rather than the Nasdaq-100, so it's broader (less mega-cap-tech-concentrated) and typically **less volatile per point** than NQ — smaller average range, tighter wicks. Everything in this library translates directly: same cash session (9:30 ET open), same killzones, same AMD framing. The main adjustment is expectation-setting — an MNQ trader who sizes an MES stop the same number of *points* as they'd use on MNQ is taking on a different risk profile, because MES moves fewer points per unit of time. Recalculate stop distance in points against MES's own recent ATR, don't copy MNQ's.

ES/MES is also the standard SMT partner for NQ/MNQ — see [SMT Divergence](/theory/smt-divergence) for how to use it as a confirmation chart even if you never place a trade on it.

## Gold (GC / MGC) — a different volatility driver entirely

Gold is not equity-index behavior. It's driven primarily by real interest rates, the US Dollar Index (DXY, inversely correlated), and macro risk sentiment, with less of the sharp time-of-day rhythm that equity index futures show around the 9:30 cash open. What still applies: liquidity sweeps, FVGs, order blocks, and market structure all read the same way technically. What's different:

- **Session emphasis shifts.** London (roughly 3:00-8:00 ET) and early NY hours matter more relative to the US cash open than they do for NQ/ES — a large share of gold's daily range can already be established before 9:30 ET.
- **DXY correlation is a real confirmation layer.** A gold move without a corresponding inverse move in DXY is lower-conviction than one confirmed by DXY.
- **News risk is different.** CPI, Fed rate decisions, and NFP move gold sharply (rates-driven), often more than they move NQ.

## Crude Oil (CL / MCL) — scheduled-report volatility

Crude has two recurring, high-impact scheduled events that don't exist for equity index futures:

- **EIA Petroleum Status Report** — every Wednesday at 10:30 ET (delayed a day after a federal holiday). This is the single biggest recurring scheduled volatility event in crude oil, comparable in importance to NFP for equities.
- **API Weekly Statistical Bulletin** — Tuesdays at 4:30 PM ET, a preview report that often moves price ahead of the official EIA number the next day.

Both belong in the same category as this library's [High-Impact News Playbook](/theory/high-impact-news-playbook) treatment of scheduled releases: know the time, reduce size or stand aside going in, and treat the reaction candle the same way the 10am Powell model treats a news candle — mark the range, watch for sweep-then-reverse vs. genuine displacement.

## Russell 2000 (RTY / M2K) — the small-cap beta play

RTY tracks small-cap stocks rather than mega-caps, so its correlation to NQ/ES is real but looser — RTY can diverge from the larger indices on days where small-cap-specific sentiment (rate-cut expectations, risk-on/risk-off rotation) dominates. That divergence is itself useful: see the SMT doc's note on RTY as a broader sentiment tie-breaker. RTY/M2K's tick value ($5.00 / $0.50) sits between MNQ and MES in dollar terms per point, so recalculate position size from the Position Sizing tool (Tools tab) rather than assuming MNQ-equivalent sizing.

## What actually carries over vs. what doesn't

| Concept | Carries over unchanged | Needs adjustment per instrument |
| --- | --- | --- |
| Liquidity sweeps, BSL/SSL, equal highs/lows | Yes — universal price-action mechanic | — |
| FVG / order block / breaker / rejection block | Yes — universal | — |
| Market structure (BOS/MSS/displacement) | Yes — universal | — |
| AMD / Power of 3 daily cycle | Concept yes | Session emphasis (which phase dominates when) shifts per instrument |
| Killzones / time-of-day windows | Concept yes | Exact high-probability windows shift — gold and crude have different peak-volatility hours than equity indices |
| Scheduled-news risk | Concept yes | The actual calendar is different per instrument (EIA/API for crude, CPI/Fed for gold, NFP/ISM/Powell for equities) |
| Position sizing math | Formula yes | Point value and typical stop distance (in points) are instrument-specific — never reuse an MNQ stop-distance habit on another product |

## Rules

- Before trading (or even just watching) an instrument outside MNQ/NQ/MES/ES, look up its current contract specs and scheduled-news calendar — don't assume they match what you already know.
- Recalculate stop distance in points against that instrument's own recent volatility, not against MNQ habits.
- If you use an instrument purely as a confirmation/correlation chart (ES for SMT, DXY for gold context), you don't need to trade it — just read it.

## Further study

- [CME Group — Micro E-mini Futures Products Overview](https://www.cmegroup.com/education/courses/micro-e-mini-futures/micro-e-mini-futures-products-overview) — official specs for the micro equity index contracts.
- [CME Group — Gold Futures Contract Specs](https://www.cmegroup.com/markets/metals/precious/gold.contractSpecs.html) — official GC specs; MGC is the 1/10-size, cash-settled micro version.
- [CME Group — Understanding the Oil Data Report](https://www.cmegroup.com/education/courses/learn-about-key-economic-events/understanding-the-oil-data-report) — how the EIA weekly report works and why it moves crude oil futures.
- [U.S. Energy Information Administration — Weekly Petroleum Status Report schedule](https://www.eia.gov/petroleum/weekly/includes/schedule.php) — exact release dates and holiday adjustments.
