-- Enum types mirror src/lib/constants/enums.ts exactly. If you change a value
-- there, add a new migration here (ALTER TYPE ... ADD VALUE) — never edit an
-- already-applied enum migration.

create type public.instrument_enum as enum ('MNQ', 'NQ', 'MES', 'ES', 'ETH', 'Other');

create type public.direction_enum as enum ('Long', 'Short');

create type public.session_enum as enum ('Asia', 'London', 'NY AM', 'NY Lunch', 'NY PM');

create type public.model_enum as enum (
  '10am Powell (ATM)',
  'Rejection Block',
  'Order Block',
  'Breaker Block',
  'FVG / IFVG',
  'Liquidity Sweep + MSS',
  'Double Sweep',
  'SMT Divergence',
  'Silver Bullet',
  'Judas Swing',
  'Other'
);

create type public.amd_phase_enum as enum ('Accumulation', 'Manipulation', 'Distribution', 'Unclear');

create type public.bias_alignment_enum as enum ('With Bias', 'Against Bias', 'No Bias');

create type public.result_enum as enum ('Win', 'Loss', 'Break Even');

create type public.setup_grade_enum as enum ('A+', 'A', 'B', 'C');

create type public.emotion_enum as enum (
  'Calm', 'Confident', 'FOMO', 'Revenge', 'Fear', 'Hesitant', 'Overconfident'
);

create type public.mistake_enum as enum (
  'Early entry',
  'Late entry',
  'Moved stop',
  'Oversized',
  'Skipped confirmation',
  'Traded against bias',
  'Cut winner early',
  'Overtraded',
  'None'
);

create type public.weekly_bias_enum as enum ('Bullish', 'Bearish', 'Neutral');

create type public.daily_bias_enum as enum ('Bullish', 'Bearish', 'Neutral', 'No Trade');

create type public.confidence_enum as enum ('High', 'Medium', 'Low');

create type public.expected_amd_profile_enum as enum (
  'Classic (Judas then reversal)',
  'Continuation (no reversal)',
  'Reversal of prior day',
  'Consolidation / Chop'
);

create type public.bias_outcome_enum as enum ('Correct', 'Partial', 'Wrong', 'No Trade Day');

create type public.week_grade_enum as enum ('A', 'B', 'C', 'D', 'F');

create type public.weekly_bias_correct_enum as enum ('Yes', 'Partial', 'No');

create type public.theory_category_enum as enum (
  'Framework', 'Time & Session', 'PD Arrays', 'Liquidity', 'Structure', 'Bias Process', 'Risk & Psychology'
);

create type public.theory_priority_enum as enum ('Core', 'Secondary', 'Advanced');

create type public.theory_use_for_enum as enum (
  'Daily Bias', 'Entry Model', 'Confirmation', 'Targeting', 'Invalidation'
);

create type public.screenshot_kind_enum as enum ('before', 'after');

create type public.drawdown_type_enum as enum ('static', 'trailing', 'eod_trailing');
