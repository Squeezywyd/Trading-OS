---
title: "Risk Management & Prop Rules"
category: "Risk & Psychology"
summary: "Position sizing formula, contract values, R-multiple and expectancy math, daily stop rules, and a block for your LucidFlex 50K rules."
use_for: ["Invalidation"]
priority: "Core"
slug: "risk-management-prop-rules"
---

> **Key Point:** Risk is decided before entry. Position size comes from stop distance and a fixed dollar risk, never the reverse.

## Contract values

| Contract | USD per point | USD per tick |
| --- | --- | --- |
| MNQ | 2 | 0.50 (tick 0.25) |
| NQ | 20 | 5.00 |
| MES | 5 | 1.25 (tick 0.25) |
| ES | 50 | 12.50 |

## Sizing
- Contracts = risk in USD / (stop in points x USD per point)
- Example: risk USD 80, stop 20 points, MNQ: 80 / (20 x 2) = 2 contracts.
- Round down. Never round up to hit a target.

## R and expectancy
- R = P&L / risk taken on the trade. The Trade Journal calculates it from Risk and P&L.
- Expectancy per trade = (win rate x average win in R) - (loss rate x average loss in R).
- Positive expectancy over 30+ trades is the only evidence a model works.

## Daily rules (fill in your numbers)
- Max risk per trade:
- Max trades per day:
- Daily stop (loss in USD or R):
- Daily profit stop:
- After 2 consecutive losses: stop / half size
- Break-even rule:

## LucidFlex 50K rules (copy from your dashboard)
- Profit target:
- Max loss / drawdown type:
- Daily loss limit:
- Consistency rule:
- Max contracts / scaling:
- News trading: allowed on Flex
- Payout conditions:

## Hard rules
- Never widen a stop. Only tighten.
- One account, one plan. No revenge sizing.
- Any rule break goes into the Mistakes field and the weekly Rule Breaks count.
