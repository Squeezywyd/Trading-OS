---
title: "Opening Levels & Judas Swing"
category: "Time & Session"
summary: "Midnight, 8:30 and 9:30 opens, opening gaps (NWOG/NDOG/ORG) and the Judas swing. Buy below the open in bull days, sell above it in bear days."
use_for: ["Daily Bias", "Entry Model", "Targeting"]
priority: "Core"
slug: "opening-levels-judas-swing"
---

> **Key Point:** Opens act as the pivot for each period. Premium is above the open, discount is below it. Match your entry side to bias.

## Key opens

- **Midnight Open (00:00 ET):** the **true day open** — the reference ICT treats as the actual pivot for the trading day, distinct from any exchange session open. Used as the premium/discount dividing line for the day.
- **8:30 Open:** the US cash-equity pre-market data anchor; most major scheduled releases (CPI, NFP, PPI, retail sales) land at 8:30 ET, so this level marks where price was *before* the day's biggest catalyst.
- **9:30 Open:** the NYSE/Nasdaq cash open. Index futures (ES/NQ and their micros) treat this as the start of "regular hours" price action and the reference for the NY session range.
- **True Day Open vs. Midnight Open:** these are the same thing in ICT terminology — "true day open" is just the explicit name for why 00:00 ET (not 9:30) is the day's real pivot.
- **Weekly Open:** Sunday 18:00 ET futures open (the first print after the weekend halt). Reference for the week's premium/discount.

## Why the open matters more than it looks

An "open" isn't just a timestamp — it's the level the market has to decide to be above or below. Because manipulation (see [AMD / Power of 3](/theory)) routinely pushes price to the *wrong* side of the relevant open before the real move, the open becomes your discount/premium filter: if you're bullish and price is still trading above today's midnight open, you are technically in premium relative to the day — the "buy" is not cheap yet, and chasing it means buying into where the manipulation leg, not the distribution leg, typically occurs.

## Rules
- Bullish bias: only look for longs **below** the relevant open. Price above the open in a bull day means the discount was skipped, wait or stand down.
- Bearish bias: only look for shorts **above** the open.
- Open crossed and held by a body close against bias = reduce confidence.

## Judas swing

A fake move at the start of a session that goes against the true direction — named for the betrayal: the move looks like the real direction, then reverses.

- Occurs at London open, NY open, or after news.
- Defined by: sweep of a nearby liquidity level, then fast reversal that breaks structure (MSS).
- Entry: retrace into the FVG or OB left by the reversal. Stop beyond the swing extreme.
- Invalid if price keeps closing beyond the swept level without displacement back.

### Judas swing vs. plain manipulation

Every Judas swing is a manipulation leg, but the term specifically describes the **opening** move of a session — the first push right after London or NY opens, when liquidity from the prior session (Asia range, or NY's own prior-day levels) is closest and easiest to raid. A manipulation leg that happens mid-session, away from an open, is still manipulation in the AMD sense but isn't usually called a Judas swing.

## Opening gaps

| Gap | Definition | Use |
| --- | --- | --- |
| NWOG | New Week Opening Gap: Friday ~17:00 ET close to Sunday 18:00 ET open | Support/resistance and magnet. Its 50% is the key level. |
| NDOG | New Day Opening Gap: prior day's 17:00 ET close to that evening's 18:00 ET open | Daily magnet and reaction zone (futures halt for that one hour Mon-Thu). |
| ORG | Opening Range Gap: 16:15 close to 09:30 open on index futures | NY session reaction zone. Price tends to fill or respect the 50%. |

These gaps exist because CME futures halt trading for a short daily maintenance window (and the full weekend) — whatever price prints the moment trading resumes is rarely the exact price it stopped at, leaving a literal void with no orders transacted inside it. ICT treats that void the same way it treats an FVG: a magnet the market is statistically drawn back to, because there's no resting liquidity or fair-value acceptance inside it yet.

Rule: treat the gap midpoint (consequent encroachment) as the decision level. Rejection at the 50% continues the move, body close through it flips the read.

## Worked example (NDOG)

Friday's 17:00 ET close on NQ: 19,940.00. Sunday's 18:00 ET open: 19,905.00. That's a 35-point NDOG, midpoint (CE) at 19,922.50. Through the week, price trades back up into the gap; a wick tags 19,922.50 and rejects with a bearish close below it — that rejection confirms the gap's 50% as resistance and the down-move continues. Had price instead closed a full body *above* 19,922.50, the read flips: the gap is being filled/accepted, treat it as support on the next retest instead.

![Diagram: NDOG opening gap with consequent-encroachment midpoint, and a Judas swing sweep-then-reversal into an FVG entry](/theory/diagrams/opening-levels-judas-swing.svg)

## Further study

- [CME Group trading hours and maintenance schedule](https://www.cmegroup.com/markets/equities/nasdaq/micro-e-mini-nasdaq-100.contractSpecs.html) — confirm the exact daily halt window for your specific contract; it drives when NDOG actually forms.
- [CME Globex holiday and hours calendar](https://www.cmegroup.com/tools-information/holiday-calendar.html) — weekly open times shift around holidays, which shifts NWOG timing too.
