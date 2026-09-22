---
title: "Daily Bias: Top-Down Process"
category: "Bias Process"
summary: "Step-by-step routine to build a daily bias: HTF draw, location, previous-day logic, news, expected AMD. Run before every NY session."
use_for: ["Daily Bias", "Invalidation"]
priority: "Core"
slug: "daily-bias-top-down-process"
---

> **Key Point:** Bias = which side of liquidity price is being drawn to today, plus the level that proves you wrong. It is not a prediction of every candle, and it is not optional research — it's the filter every entry model in this library runs through.

## Why top-down, and why in this order

Every timeframe tells a different part of the story, and lower timeframes lie constantly — a 1-minute chart can look bullish inside a daily downtrend for hours. ICT's top-down process exists to stop that noise from overriding the real narrative: you decide direction and destination on the timeframes that matter (weekly, daily), then drop down only to time the entry. Skipping straight to the 5-minute chart without this sequence is the single most common reason a technically "clean" setup fails — it was clean in the wrong direction.

The sequence below runs the same way every session. Do it before the killzone opens, not during it — once price is moving, the temptation to bend the read to match what you're watching is too strong.

![Diagram: top-down timeframe funnel from Weekly to LTF entry](/theory/diagrams/daily-bias-top-down-process.svg)

## Routine (run in this order)

1. **HTF draw on liquidity.** Weekly, then Daily: find the nearest untouched liquidity pool (previous week high/low, previous day high/low, old swing highs/lows, equal highs/lows) and the nearest unfilled HTF PD array (FVG, OB) in the expected direction. This is your *destination*, not your entry — ICT calls it the draw on liquidity (DOL), and it should be the **nearest** significant pool in the bias direction, not the most distant one you can find.
2. **Location.** Where does the current price sit inside the Daily/Weekly range — premium (top half) or discount (bottom half)? Discount favors looking for longs, premium favors looking for shorts. A long from premium or a short from discount needs a much stronger reason to override the location disadvantage.
3. **Previous-day logic.** Use the table below to read what yesterday's candle actually did relative to PDH/PDL, not just where it closed.
4. **Reaction check.** Did price reject from an HTF PD array (wick through it, body closes back outside) or accept it (body closes through, holding the other side)? Rejection favors fading that level; acceptance favors continuation through it.
5. **Reference opens.** Where is price relative to the Midnight Open, the 8:30 Open, and the 9:30 Open? On a bullish day, price should be buying below these opens (trading at a discount to them intraday). On a bearish day, it should be selling above them. If price is doing the opposite of what your bias implies relative to the opens, that's an early warning, not proof — but weight it.
6. **News.** List every high-impact release for the day with its time in ET (see the High-Impact News Playbook). Mark the one event, if any, you intend to trade around — everything else is a reason to stand aside or tighten size in the minutes before/after.
7. **Expected AMD profile.** Given the day of week and the current weekly range profile (see Weekly & Daily Range Profiles), which side is more likely to get manipulated first, and in roughly which session? This is a hypothesis, not a certainty — it exists so you recognize the manipulation leg when it happens instead of being fooled by it.
8. **Write it down** in Daily Prep: bias, confidence, draw, invalidation, game plan. An unwritten bias isn't a bias — it's a feeling you'll edit in real time to match whatever the market just did.

## Worked example

Weekly chart: three consecutive weeks of higher highs and higher lows — weekly structure is bullish, and Monday's weekly candle is still trading inside the range of the prior week's up-close candle, i.e. no bearish weekly reversal signal yet. Nearest untouched weekly liquidity above is a swing high from five weeks back; nearest below is last week's low, already partially raided.

Daily chart: Tuesday closed with a wick above Monday's high that reversed and closed back below it — a failed buy-side raid (row 2 in the table below). That's bearish for Wednesday, with sell-side liquidity (Monday's low, then the weekly low) as the draw.

Location: price is sitting in the upper third of the current weekly range — premium. That agrees with the bearish read from the daily reaction.

Opens: price is currently trading above the Midnight Open and the 8:30 Open. For a bearish day, that's a disagreement — flag it, don't override the higher-timeframe read from it alone.

News: CPI at 8:30 ET. Given the size of that release, the plan is to wait for the post-CPI reaction rather than trade the number itself (see the High-Impact News Playbook for why).

Conclusion written in Daily Prep: **Bearish bias, medium confidence** (two of three location/reaction/previous-day signals agree; opens disagree). Draw on liquidity: Monday's low, then last week's low. Invalidation: a 15-minute body close back above Tuesday's high. Game plan: wait for CPI reaction, look for a liquidity sweep + MSS to the downside in the NY AM killzone, entry on the resulting OB/FVG.

## Previous-day behavior to bias

| Yesterday | Meaning | Bias today |
| --- | --- | --- |
| Closed above PDH with displacement | Buy-side accepted | Bullish continuation. Buy pullbacks into discount or FVG above PDH. Target next BSL. |
| Wicked above PDH, closed back below | Buy-side raid failed | Bearish. Target PDL then SSL. |
| Closed below PDL with displacement | Sell-side accepted | Bearish continuation. Sell rallies into premium or FVG below PDL. Target next SSL. |
| Wicked below PDL, closed back above | Sell-side raid failed | Bullish. Target PDH then BSL. |
| Inside day (neither PDH nor PDL taken) | Range, one side still to be raided | No bias until a raid happens. Trade the reversal after the sweep. |
| Outside day (both taken) | Expansion both ways, unclear | Lower confidence. Reduce size or skip. |

## Confidence

- **High:** draw, location, previous-day logic and news all point the same way.
- **Medium:** two of the three agree (opens can disagree without killing a high read, since opens react fastest to LTF noise).
- **Low:** conflict. Half size or no trade.

## Invalidation rules

- A body close (not a wick) through the HTF PD array you are leaning on.
- Price takes the opposite-side liquidity first and displaces away from it before your entry window opens — the market told you which side it actually wanted before you got your setup.
- Bias is void once invalidated. Do not re-argue it mid-session; write a new one from the current structure instead of patching the old one.

## Common mistakes

- **Building bias from the 5-minute chart.** If the first chart you opened today was intraday, you built a reaction, not a bias.
- **Chasing the most distant liquidity pool** because it "looks bigger," instead of the nearest one actually in the way.
- **Treating a wick-only sweep as acceptance.** A sweep that immediately reverses is often *stronger* evidence for the opposite bias than a wick in your favor is evidence for yours.
- **Never invalidating.** A bias with no invalidation level isn't a trading decision, it's a hope.

## Pre-session checklist

- [ ] HTF draw on liquidity identified (nearest pool, not the biggest)
- [ ] Premium/discount location noted
- [ ] Previous-day row picked from the table
- [ ] News times listed for the day, trade-around event marked
- [ ] Invalidation level written as a specific price
- [ ] Daily Prep entry created before the killzone opens

## Further study

- [ICT Daily Bias: The Most Important Pre-Session Decision](https://www.theinnercircletraders.com/daily-bias-ict-trading/) — walks the weekly-structure-first framework this doc is built on.
- [ICT Draw on Liquidity: Where Price Is Heading](https://www.theinnercircletraders.com/ict-draw-on-liquidity/) — on why the draw is the nearest pool, not the furthest.
