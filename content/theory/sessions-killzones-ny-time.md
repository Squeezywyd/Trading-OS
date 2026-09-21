---
title: "Sessions & Killzones (NY time)"
category: "Time & Session"
summary: "Session windows, killzones and Silver Bullet hours in New York time with Zurich conversion. Time is the filter: trade only inside your windows."
use_for: ["Entry Model", "Confirmation"]
priority: "Core"
slug: "sessions-killzones-ny-time"
---

> **Key Point:** Price is only delivered with intent inside specific windows. Outside them, treat moves as noise.

## Windows (New York time)

| Window | Time ET | Role |
| --- | --- | --- |
| Asia | 20:00 to 00:00 | Accumulation range. Mark high and low. |
| Midnight Open | 00:00 | Reference open for the day. |
| London killzone | 02:00 to 05:00 | Often the manipulation of the day. Sets daily high or low. |
| NY killzone (AM) | 07:00 to 10:00 | Main distribution window. Includes 8:30 data and 9:30 cash open. |
| 8:30 Open | 08:30 | Major US data release. Futures react immediately. |
| 9:30 Open | 09:30 | Equity cash open, opening range forms. |
| 10:00 news | 10:00 | Second-tier data and Fed speakers. Your 10am model window. |
| London close | 10:00 to 12:00 | Retracement or reversal of the morning move. |
| NY lunch | 12:00 to 13:00 | Low quality, chop. No entries. |
| NY PM | 13:30 to 16:00 | Afternoon continuation or reversal. FOMC at 14:00. |

## Silver Bullet windows (one-hour setups)
- 03:00 to 04:00 (London)
- 10:00 to 11:00 (NY AM)
- 14:00 to 15:00 (NY PM)

Rule: inside the window, after a liquidity sweep, take the first FVG formed in the direction of the displacement. Target the opposing liquidity. One attempt per window.

## Zurich conversion
NY 09:30 = Zurich 15:30. NY 10:00 = Zurich 16:00. NY 08:30 = Zurich 14:30.

This holds with a 6-hour gap. In the weeks when US and EU daylight saving differ (late March, and 25 Oct to 1 Nov), the gap is 5 hours. Check before trading.

## Rules
- Log the session on every trade.
- No entries in NY lunch.
- Data-driven days: wait for the news candle to close before defining the range.
