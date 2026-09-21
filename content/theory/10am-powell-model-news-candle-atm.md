---
title: "10am Powell Model (News Candle + ATM)"
category: "Framework"
summary: "News-candle entry model around the 10:00 ET release/Powell window, run through a fixed ATM bracket. Includes a blank rule block to lock in your exact mechanics."
use_for: ["Entry Model", "Targeting"]
priority: "Core"
slug: "10am-powell-model-news-candle-atm"
---

> **Warning:** The framework below is the general news-candle logic. Fill in the **My exact rules** block with your own mechanical entry, so this page matches what you actually trade.

## Why 10:00 ET
Many scheduled releases and Fed speakers land at 10:00 ET (JOLTS, ISM, consumer confidence, some Powell appearances). Futures are already 30 minutes into the cash session, liquidity is set, and the news candle often sweeps one side before delivering direction.

## Model logic
1. **Pre-news:** mark the range since 9:30, the session high/low, and the nearest FVG/OB. Note bias from Daily Prep.
2. **News candle:** the 1m/5m candle that opens at 10:00. Record its **open**, high and low.
3. **Reaction:** first move is usually the manipulation. It sweeps a level (range high/low) and reverses, or it displaces and holds.
4. **Entry:** on a retrace to the news-candle open, a rejection block or an FVG formed by the reversal. Direction follows bias and the side that got swept.
5. **Stop:** beyond the news-candle extreme (the spike).
6. **Target:** opposite side of the pre-news range, or next liquidity pool.

## ATM bracket (NinjaTrader Advanced Trade Management)
The ATM places stop and targets automatically at entry so the plan is fixed before emotion.

| Parameter | Your setting |
| --- | --- |
| Contracts | 2 MNQ |
| Stop | 10 to 20 points |
| Risk at 2 MNQ | USD 40 to 80 (2 contracts x USD 2/pt x 10 to 20 pts), before commissions and slippage |
| Frequency | About 2 to 3 setups per week |

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
- Log every attempt in Trade Journal with model = 10am Powell (ATM), including skipped setups in Lesson.
