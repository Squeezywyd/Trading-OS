---
title: "SMT Divergence"
category: "Liquidity"
summary: "Correlated instruments failing to confirm each other at a key level. Use as confirmation of a sweep and reversal."
use_for: ["Confirmation", "Invalidation"]
priority: "Secondary"
slug: "smt-divergence"
---

> **Key Point:** When correlated markets disagree at a liquidity level, the one that fails to take the level is showing the true strength or weakness.

## Pairs
- NQ / ES / YM (equity index futures)
- Inverse: DXY vs risk assets, or 2Y yield vs indices
- Related crypto pairs (BTC / ETH)

## Bearish SMT (at highs)
- One index makes a new high (takes BSL). The other fails to make a new high.
- The one that failed is stronger sellers. Look for shorts once the leader shows MSS.

## Bullish SMT (at lows)
- One index makes a new low (takes SSL). The other holds a higher low.
- Look for longs on MSS.

## Rules
- Only count SMT at a **defined liquidity level** (session high/low, PDH/PDL, equal highs/lows).
- SMT is confirmation, never the trigger by itself. You still need MSS and a PD array entry.
- Check on the same timeframe for both instruments.
- SMT that disappears after a clean body-close through the level in both = invalid, run confirmed.
