---
title: "Sessions & Killzones (NY time)"
category: "Time & Session"
summary: "Session windows, killzones and Silver Bullet hours in New York time with Zurich conversion. Time is the filter: trade only inside your windows."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "sessions-killzones-ny-time"
---

> **Key Point:** Price is only delivered with intent inside specific windows. Outside them, treat moves as noise.

## Why time is the filter

The same pattern — a swept level, a rejection block, an FVG — means something different depending on when it happens. Institutional order flow is not random around the clock: it clusters around session opens, session closes, and scheduled data, because that is when the largest participants actually need to transact size. ICT's "time and price" framework treats the clock as a filter that runs *before* the pattern filter: you don't look for a setup and then check the time, you wait for the window and then look for the setup inside it. A textbook liquidity sweep + MSS + FVG sequence during NY lunch is lower-quality than the same sequence during the NY AM killzone, because lunch genuinely has less real participation behind the move.

## Windows (New York time)

| Window | Time ET | Role |
| --- | --- | --- |
| Asia | 20:00 to 00:00 | Accumulation range. Mark high and low — this becomes the reference range London and NY react against. |
| Midnight Open | 00:00 | Reference open for the day; price above/below it is a simple bias tell many ICT-style traders track intraday. |
| London killzone | 02:00 to 05:00 | Often the manipulation of the day. Frequently sets the daily high or the daily low by sweeping the Asian range. |
| NY killzone (AM) | 07:00 to 10:00 | Main distribution window. Includes the 8:30 data release and the 9:30 cash open. |
| 8:30 Open | 08:30 | Major US data (CPI, NFP, PPI, jobless claims, retail sales). Futures react immediately — see the High-Impact News Playbook. |
| 9:30 Open | 09:30 | Equity cash open, opening range forms — see Opening Levels & Judas Swing. |
| 10:00 news | 10:00 | Second-tier data and Fed speakers. The 10am Powell (ATM) model window. |
| London close | 10:00 to 12:00 | Retracement or reversal of the morning move as European desks flatten. |
| NY lunch | 12:00 to 13:00 | Low quality, thin participation, chop. No entries. |
| NY PM | 13:30 to 16:00 | Afternoon continuation or reversal. FOMC statement at 14:00, press conference at 14:30 on meeting days. |

## The Asian range as the day's anchor

Asia is not "dead time" — it's where the day's initial accumulation range gets built. Mark its high and low before London opens. Everything that follows reacts to that range: London typically either sweeps one side of it (manipulation) before reversing, or breaks and holds it (early trend day). Writing the Asian high/low down in Daily Prep before London opens is the single cheapest piece of context you can gather.

## London killzone (02:00–05:00)

This is usually where the daily manipulation happens: a run at the Asian high or low (sometimes both — a double sweep, see the Double Sweep / Turtle Soup doc) that fails to hold, tagging one side of the day's eventual range. A London session that instead breaks and *holds* outside the Asian range is a stronger trend signal for the rest of the day. Either way, mark whatever London does — the high or low it sets is a level NY will very likely interact with.

## NY AM killzone (07:00–10:00) and the Silver Bullet hour

This is the main distribution window: the 8:30 data candle, the 9:30 cash open and opening range, and the 10:00–11:00 Silver Bullet hour all sit inside it. Full Silver Bullet mechanics (the specific one-hour reversal setup ICT teaches for 10–11am and 2–3pm) have their own dedicated doc — this page is only about *when* that window sits inside the day, not how to trade it.

## NY lunch (12:00–13:00) — why to skip it

Desks that run the morning's real size are done rebalancing by noon and don't come back until the afternoon. Volume and range compress, and moves that look like setups during lunch fail at a much higher rate simply because there isn't enough real participation behind them to follow through. The rule is mechanical, not a feel call: no entries in this window, full stop.

## London close (10:00–12:00) and NY PM (13:30–16:00)

London close often produces a retracement of whatever the AM session did, as European books flatten into their close. NY PM is either a continuation of the day's established direction or, on FOMC days, an entirely new leg — the 14:00 statement and 14:30 press conference frequently disagree with each other, producing a whipsaw before the real direction holds (see the High-Impact News Playbook).

## Worked daily timeline example (MNQ)

1. **20:00–00:00 (Asia):** range builds 19,850–19,910. Mark both levels.
2. **02:00–05:00 (London):** price runs up through 19,910, taps 19,922, and reverses hard back below 19,880 — a swept Asian high, i.e. the day's manipulation. London low prints 19,845, just under the Asian low.
3. **07:00–08:30 (NY AM pre-data):** consolidates 19,850–19,880, holding above the London low. Bias: bullish, targeting back toward 19,922 and beyond.
4. **08:30:** data releases, a fast two-sided spike, closes back inside the pre-news range within a few minutes — no real edge here, just noted.
5. **09:30–10:00:** opening range forms 19,860–19,895.
6. **10:00–11:00 (Silver Bullet):** a sweep of the 09:30 opening-range low into 19,852, then MSS back up through 19,895 with displacement and an FVG left behind. Entry on the FVG retrace, stop below the sweep, target the London high at 19,922.
7. **12:00–13:00:** skipped entirely — NY lunch.
8. **13:30–16:00:** continuation through 19,922 toward the weekly draw, or a reversal if the day's story changes — read live, don't assume.

## Zurich conversion

| NY time (ET) | Zurich time (CET/CEST) |
| --- | --- |
| 08:30 | 14:30 |
| 09:30 | 15:30 |
| 10:00 | 16:00 |
| 14:00 | 20:00 |

This holds with a steady 6-hour gap for most of the year. US and EU daylight-saving transitions don't land on the same calendar date each spring and autumn, so for a stretch of about one to two weeks — US "springs forward" a week or two before the EU does in March, and the EU "falls back" a week or two before the US does in late October/early November — the gap is 5 hours instead of 6. Check the actual offset on your platform during those transition windows rather than trusting the table blindly.

## Rules

- Log the session on every trade in the Trade Journal.
- No entries in NY lunch.
- Data-driven days: wait for the news candle to close before defining the range around it.
- Mark the Asian high/low and the London high/low before the NY AM killzone opens — both are live targets for the rest of the day.

## Further study

- [CME Group — Nasdaq-100 futures (official trading hours & specs)](https://www.cmegroup.com/markets/equities/nasdaq.html)
- [CME Group — Micro E-mini Nasdaq-100 (MNQ) contract page](https://www.cmegroup.com/markets/equities/nasdaq/micro-e-mini-nasdaq-100.html)
- [Inner Circle Trader — ICT Killzones, all four session times](https://innercircletrader.net/tutorials/master-ict-kill-zones/)

![Diagram: a 24-hour session timeline showing Asia, London, NY AM/Silver Bullet, NY lunch and NY PM killzone windows in New York time](/theory/diagrams/sessions-killzones-ny-time.svg)
