---
title: "Risk Management & Prop Rules"
category: "Risk & Psychology"
summary: "Position sizing formula, contract values, R-multiple and expectancy math, drawdown types explained, daily stop rules, and a block for your LucidFlex 50K rules."
use_for: ["Invalidation"]
priority: "Core"
slug: "risk-management-prop-rules"
---

> **Key Point:** Risk is decided before entry. Position size comes from stop distance and a fixed dollar risk, never the reverse — if you're solving for "how many contracts get me back to even," you've already broken the rule.

## Contract values

| Contract | USD per point | USD per tick |
| --- | --- | --- |
| MNQ | 2 | 0.50 (tick 0.25) |
| NQ | 20 | 5.00 |
| MES | 5 | 1.25 (tick 0.25) |
| ES | 50 | 12.50 |

## Sizing formula

**Contracts = risk in USD ÷ (stop in points × USD per point)**

Worked example: risk budget $80, stop 20 points, trading MNQ (2 USD/point): 80 ÷ (20 × 2) = **2 contracts**. If the same stop needed 3.4 contracts, round down to 3 — never up. Rounding up to "make the trade worth it" is sizing the trade to your ego, not to your risk budget.

A second example on MES: risk budget $150, stop 12 points, MES (5 USD/point): 150 ÷ (12 × 5) = 2.5 → **2 contracts**, actual risk $120. That's fine — actual risk should come in at or under budget, never over.

## R and expectancy

- **R** = P&L ÷ risk taken on the trade. The Trade Journal calculates this automatically from Risk and P&L on every logged trade.
- **Expectancy per trade** = (win rate × average win in R) − (loss rate × average loss in R). A system with a 40% win rate and an average winner of 2.5R against an average loser of 1R still has positive expectancy: (0.4 × 2.5) − (0.6 × 1) = 1.0 − 0.6 = **+0.4R per trade**.
- Expectancy only means something over a sample. Positive expectancy over 30+ trades is the minimum evidence a model works — five winners in a row proves nothing either way.

## Drawdown types, and why they change how you size

Prop firms measure the "you failed" line in three different ways, and the difference changes how aggressively you can size as the account grows:

- **Static drawdown.** The floor is fixed from the starting balance and never moves. A $50K account with a $2,500 static drawdown always fails below $47,500, even after the account has grown to $60K. This is the most forgiving type — profit becomes a permanent cushion.
- **Trailing drawdown.** The floor rises with every new equity high (the "high-water mark"), calculated in real time including open, unrealized profit. Grow to $53K intraday with a $2,500 trailing drawdown and the floor is now $50,500 — even if the account gives back to $52K by the close, an intraday dip below $50,500 is a breach. This is the hardest type to manage because your margin of safety never really increases; wide stops on a winning streak can walk you straight into your own trailing floor.
- **EOD (end-of-day) trailing drawdown.** Same high-water-mark logic as trailing, but it only recalculates at the daily close using realized P&L — intraday swings can't breach it. This is meaningfully more forgiving than real-time trailing while still tightening the floor over time.

This app tracks `drawdown_type` as `static`, `trailing`, or `eod_trailing` per account — know which one you're on before you size a stop wider "because there's room." On real-time trailing, there frequently isn't as much room as the account balance suggests.

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

A **consistency rule**, common across prop firms, caps how much of total profit can come from a single day — typically 20-30%, calculated as best day ÷ total profit. It exists to filter out accounts that passed on one lucky windfall rather than repeatable process. Most firms treat a breach as a soft one: it doesn't fail the account, but it holds or delays the payout until enough other profitable days dilute the outsized one below the cap. Don't let the rule tempt you into holding a winner past your actual target just to "bank it before the cap resets" — that's letting a payout mechanic override your exit plan.

## Hard rules

- Never widen a stop. Only tighten.
- One account, one plan. No revenge sizing.
- Any rule break goes into the Mistakes field and the weekly Rule Breaks count.

## Further study

- [Trailing Drawdown Explained: How It Actually Works](https://www.tradezella.com/blog/trailing-drawdown) — real-time vs EOD trailing mechanics with worked numbers.
- [Prop Firm Drawdown Rules: Static vs Trailing](https://daytradingz.com/prop-firm-drawdown/) — comparison across firm types.
- [What Is the Consistency Rule in Prop Trading?](https://propaccount.com/resources/glossary/what-is-the-consistency-rule-in-prop-trading/) — how the cap is calculated and what a breach actually costs you.
