---
title: "Glossary"
category: "Framework"
summary: "Comprehensive A-Z reference for every ICT/SMC term, abbreviation, and prop-firm term used across this Theory Library."
use_for: ["Confirmation"]
priority: "Secondary"
slug: "glossary"
---

> **Key Point:** Look terms up here instead of re-explaining them inline in the other docs — this is the single reference, so the full docs stay focused on mechanics rather than definitions.

## A

- **Accumulation** — the first phase of AMD: a period of range-bound, low-displacement price action where the market builds the position it will later manipulate away from. See AMD / Power of 3.
- **AMD** — Accumulation, Manipulation, Distribution. ICT's three-phase model for how a session or day typically unfolds; fractal, meaning it repeats inside smaller timeframes within the larger one.
- **ATM** — Advanced Trade Management, the NinjaTrader bracket order type that sets stop and targets automatically at entry so the plan is fixed before emotion can interfere.

## B

- **BISI / SIBI** — Buyside Imbalance Sellside Inefficiency / Sellside Imbalance Buyside Inefficiency. Directional naming for a Fair Value Gap depending on which side left the inefficiency — a BISI is a bullish FVG, a SIBI is a bearish one.
- **BOS** — Break of Structure. Price closes beyond the most recent swing high (bullish BOS) or swing low (bearish BOS) in the direction of the existing trend — a continuation signal, not a reversal one.
- **Body close** — a candle's open/close range, as opposed to its wick. Whether a level was broken by a body close or only wicked into changes its meaning: a body close through a level suggests acceptance, a wick-only touch suggests rejection.
- **Breaker Block** — a former order block that failed (price swept through it and reversed) and then flips polarity — a broken bullish OB becomes resistance, a broken bearish OB becomes support. See Breaker & Mitigation Block.

## C

- **CE (Consequent Encroachment)** — the 50% midpoint of a Fair Value Gap or other PD array. Price often reacts precisely at this level rather than needing to fill the entire gap.
- **CHoCH** — Change of Character. Used interchangeably with MSS in most ICT material: the first structural break against the prevailing trend, signaling a possible reversal.
- **Consistency rule** — a prop-firm payout condition capping how much of total profit can come from a single day, typically 20-30%. Exists to filter accounts that passed on one lucky day rather than repeatable process. See Risk Management & Prop Rules.
- **Correlation** — the tendency of related instruments (e.g. NQ and ES, or Gold and DXY) to move together. The basis for SMT Divergence, which looks for a break in that correlation.

## D

- **Discount** — the lower half of a price range (below its 50% equilibrium). ICT teaches looking for long entries in discount, since price is theoretically "cheap" relative to the range.
- **Displacement** — a strong, fast, one-directional move that expands range and leaves an FVG behind. The presence of an FVG is what separates genuine displacement from an ordinary large candle.
- **Distribution** — the third phase of AMD: price delivers its real, sustained directional move after manipulation has swept the opposing liquidity.
- **DOL (Draw on Liquidity)** — the nearest untouched liquidity pool in the direction of the current bias; the target price is being "drawn" toward, not the furthest one available.
- **Double Sweep** — an entry model built on two liquidity raids in sequence (often a smaller sweep followed by a larger, decisive one) before the real reversal. See Double Sweep / Turtle Soup.
- **Drawdown (static / trailing / EOD trailing)** — how a prop firm measures the account-failure floor. Static never moves from the starting balance; trailing rises with every new real-time equity high; EOD trailing rises only at the daily close using realized P&L. See Risk Management & Prop Rules.

## E

- **Equal Highs / Equal Lows (EQH / EQL)** — two or more swing points at (or very near) the same price. Reads as engineered liquidity — the market printing an obvious level specifically to attract resting stop orders above/below it.
- **Equilibrium** — the exact 50% midpoint of a price range, the line dividing premium from discount.
- **Expansion** — a range day where price displaces well beyond the prior day's or week's range, typically following a clean AMD sequence. See Weekly & Daily Range Profiles.
- **Expectancy** — the average result per trade across a sample, in R: (win rate × average win in R) − (loss rate × average loss in R). The only real evidence a model works, and only over 30+ trades.

## F

- **FVG (Fair Value Gap)** — a three-candle imbalance where candle one's wick and candle three's wick don't overlap, leaving a gap in delivered price that the market tends to revisit. See Fair Value Gap (FVG) & IFVG.

## H

- **HTF / LTF** — Higher Timeframe / Lower Timeframe. HTF (weekly, daily) sets direction and destination; LTF (1m-15m) only times the entry. See Daily Bias: Top-Down Process.

## I

- **ICT** — Inner Circle Trader, the source of the Smart Money Concepts (SMC) framework this entire library is built on.
- **IFVG (Inversion Fair Value Gap)** — an FVG that price closes back through, flipping its expected reaction from support to resistance (or vice versa) — conceptually similar to a breaker block, but applied to an FVG instead of an order block.
- **Inducement** — a smaller, earlier liquidity level engineered to trigger retail entries before the real move, distinct from the larger DOL the smart-money move is actually targeting.

## J

- **Judas Swing** — a false initial move at a session or day open that runs against the true intended direction before reversing, sweeping early liquidity on the way. See Opening Levels & Judas Swing.

## K

- **Killzone** — a specific, recurring time window (London, NY AM, NY PM, Asia) where ICT teaches the highest-probability setups form, because time filters which PD arrays are actionable. See Sessions & Killzones (NY time).

## L

- **Liquidity** — resting orders (mostly stops) clustered at an obvious price — above old highs, below old lows, or at equal highs/lows. The fuel that manipulation moves are built to consume.
- **Liquidity pool** — a specific cluster of that resting liquidity at one identifiable level, e.g. "the liquidity pool at yesterday's low."
- **Liquidity sweep / raid** — a fast move through a liquidity pool that reverses shortly after, rather than holding through it. See Liquidity: BSL, SSL, Sweeps.
- **London Killzone / London Open** — the London session window, roughly 2:00-5:00 AM NY time, often where the day's first real manipulation leg happens ahead of NY.

## M

- **Manipulation** — the second phase of AMD: a deliberate move against the eventual real direction, engineered to sweep liquidity and trap traders on the wrong side before distribution begins.
- **Midnight Open** — the 00:00 NY-time daily candle open, one of ICT's reference opens for reading whether a day is trading at a premium or discount to its own start.
- **Mitigation Block** — an order block that gets revisited (not broken) and used again as support/resistance in its original direction, as opposed to a breaker block which flips. See Breaker & Mitigation Block.
- **MSS (Market Structure Shift)** — the first structural break against the prevailing trend; used interchangeably with CHoCH in most ICT material. The trigger event most entry models here are built around.

## N

- **NDOG (New Day Opening Gap)** — the gap between one day's 00:00 close and the next day's 00:00 open on instruments/data feeds where one exists; treated as a PD array like an FVG.
- **NWOG (New Week Opening Gap)** — the same concept as NDOG, but between Friday's close and Sunday/Monday's open.
- **NY AM Killzone** — roughly 8:30-11:00 AM NY time, generally the highest-volume, highest-probability window of the US day.
- **NY Lunch** — roughly 12:00-1:00 PM NY time, a historically low-quality, choppy window most ICT material teaches to avoid trading.
- **NY PM Killzone** — roughly 1:30-4:00 PM NY time, the afternoon session window, often driven by continuation or reversal of the AM range.

## O

- **OB (Order Block)** — the last opposing candle before a displacement move that breaks structure; treated as a zone likely to hold on a retest. See Order Block (OB).
- **ORG (Opening Range Gap)** — a broader term covering NWOG/NDOG-style gaps at the open of a defined range period.
- **OTE (Optimal Trade Entry)** — the 62%-79% Fibonacci retracement zone of a recent displacement leg, treated as the highest-probability re-entry band. See Premium/Discount & OTE.

## P

- **PD array** — Premium/Discount array: any zone where price has historically reacted (order block, FVG, rejection block, breaker) and is expected to react again.
- **PDH / PDL** — Previous Day High / Previous Day Low.
- **Power of 3** — ICT's name for the AMD cycle, emphasizing that it repeats fractally across the week, the day, and individual sessions. See AMD / Power of 3.
- **Premium** — the upper half of a price range (above its 50% equilibrium). ICT teaches looking for short entries in premium.
- **PWH / PWL** — Previous Week High / Previous Week Low.

## R

- **R (R-multiple)** — a trade's result expressed as a multiple of the risk taken: P&L ÷ risk. A trade risking $100 that made $250 is a +2.5R trade.
- **Range profile** — the shape a week's or day's range tends to take (e.g. which day sets the high, which sets the low), used to anticipate where the remaining expansion is likely to happen. See Weekly & Daily Range Profiles.
- **RB (Rejection Block)** — the wick-defined zone at a swing high/low, distinct from an order block because it's defined by the wick rather than the candle body. See Rejection Block (RB).
- **Reversal** — a change in prevailing direction, typically signaled by a liquidity sweep followed by an MSS.

## S

- **Silver Bullet** — a time-boxed entry model (specific one-hour windows) looking for a liquidity sweep and FVG-based entry within that window specifically. See Silver Bullet Model.
- **SMT Divergence** — Smart Money Divergence: one of two correlated instruments makes a new high/low that the other fails to confirm, flagging a potential reversal. See SMT Divergence.
- **Swing high / low** — a local price extreme with lower highs (or higher lows) on both sides of it; the building block for reading structure and marking liquidity.

## T

- **True Day Open** — see Midnight Open; the term ICT uses for the actual start of the trading day used as a bias reference, as opposed to the 9:30 exchange open.
- **Turtle Soup** — the original name (pre-dating ICT) for a false breakout of an old high/low that immediately reverses; closely related to, and often used interchangeably with, Double Sweep in modern ICT/SMC material.

## Z

- **Zurich Open** — roughly 2:00 AM NY time, used as a session-time reference point in some killzone frameworks ahead of the London Open.

## Further study

- [The Inner Circle Traders — glossary and core-concept articles](https://www.theinnercircletraders.com/) — cross-reference for any term above.
