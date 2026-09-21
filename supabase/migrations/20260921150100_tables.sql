-- Core tables. Every user-owned row carries user_id uuid default auth.uid().
-- RLS policies are added in a later migration; nothing here is publicly
-- readable until that migration runs.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- account_settings: singleton per user. Prop-firm rules + model defaults.
-- ---------------------------------------------------------------------------
-- No prop-firm or model numbers are hardcoded here — the user enters their
-- actual LucidFlex 50K values via Settings. A blank row is auto-created for
-- each new auth user (see handle_new_user below) so the UI can always UPDATE.
create table public.account_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  account_name text,
  starting_balance_usd numeric,
  profit_target_usd numeric,
  daily_loss_limit_usd numeric,
  max_drawdown_usd numeric,
  drawdown_type public.drawdown_type_enum,
  consistency_rule_pct numeric,
  max_contracts integer,
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.account_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- model_rules: per-model default sizing/stop rules, editable in Settings.
-- ---------------------------------------------------------------------------
create table public.model_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  model public.model_enum not null,
  default_contracts integer,
  stop_min_points numeric,
  stop_max_points numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, model)
);

create trigger set_updated_at before update on public.model_rules
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- weekly_recaps
-- ---------------------------------------------------------------------------
create table public.weekly_recaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  week_start date not null,
  week_grade public.week_grade_enum,
  process_score smallint check (process_score between 1 and 10),
  rule_breaks integer default 0,
  weekly_bias_correct public.weekly_bias_correct_enum,
  what_worked text,
  what_failed text,
  key_lessons text,
  focus_next_week text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create index weekly_recaps_user_week_idx on public.weekly_recaps (user_id, week_start desc);

create trigger set_updated_at before update on public.weekly_recaps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- daily_preps
-- ---------------------------------------------------------------------------
create table public.daily_preps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  weekly_recap_id uuid references public.weekly_recaps (id) on delete set null,
  weekly_bias public.weekly_bias_enum,
  daily_bias public.daily_bias_enum,
  confidence public.confidence_enum,
  htf_draw text,
  key_levels text,
  news_events text,
  high_impact_news boolean not null default false,
  expected_amd_profile public.expected_amd_profile_enum,
  invalidation_level numeric,
  game_plan text,
  bias_outcome public.bias_outcome_enum,
  eod_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index daily_preps_user_date_idx on public.daily_preps (user_id, date desc);
create index daily_preps_weekly_recap_idx on public.daily_preps (weekly_recap_id);

create trigger set_updated_at before update on public.daily_preps
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- trades. R multiple is intentionally NOT a column — it is always derived
-- (pnl_usd / risk_usd) at query time via the trades_r view / RPC functions.
-- ---------------------------------------------------------------------------
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  daily_prep_id uuid references public.daily_preps (id) on delete set null,
  weekly_recap_id uuid references public.weekly_recaps (id) on delete set null,
  title text not null,
  date date not null,
  instrument public.instrument_enum not null,
  direction public.direction_enum not null,
  session public.session_enum not null,
  models public.model_enum[] not null default '{}',
  amd_phase public.amd_phase_enum,
  bias_alignment public.bias_alignment_enum,
  entry_price numeric,
  stop_price numeric,
  target_price numeric,
  exit_price numeric,
  contracts numeric,
  risk_usd numeric,
  pnl_usd numeric,
  result public.result_enum,
  setup_grade public.setup_grade_enum,
  followed_plan boolean not null default false,
  emotion public.emotion_enum,
  mistakes public.mistake_enum[] not null default '{}',
  entry_reasoning text,
  lesson text,
  chart_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trades_user_date_idx on public.trades (user_id, date desc);
create index trades_user_session_idx on public.trades (user_id, session);
create index trades_user_instrument_idx on public.trades (user_id, instrument);
create index trades_user_result_idx on public.trades (user_id, result);
create index trades_daily_prep_idx on public.trades (daily_prep_id);
create index trades_weekly_recap_idx on public.trades (weekly_recap_id);
create index trades_models_gin_idx on public.trades using gin (models);
create index trades_mistakes_gin_idx on public.trades using gin (mistakes);

create trigger set_updated_at before update on public.trades
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- trade_screenshots: before/after images, stored in the private "screenshots"
-- storage bucket at path {user_id}/{trade_id}/{kind}-{uuid}.{ext}
-- ---------------------------------------------------------------------------
create table public.trade_screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  trade_id uuid not null references public.trades (id) on delete cascade,
  kind public.screenshot_kind_enum not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index trade_screenshots_trade_idx on public.trade_screenshots (trade_id);

-- ---------------------------------------------------------------------------
-- theory_docs: Markdown theory library, full-text searchable.
-- ---------------------------------------------------------------------------
create table public.theory_docs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  slug text not null unique,
  title text not null,
  category public.theory_category_enum not null,
  priority public.theory_priority_enum not null default 'Secondary',
  use_for public.theory_use_for_enum[] not null default '{}',
  summary text,
  body_md text not null,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(body_md, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index theory_docs_search_idx on public.theory_docs using gin (search_vector);
create index theory_docs_category_idx on public.theory_docs (category);
create index theory_docs_use_for_idx on public.theory_docs using gin (use_for);

create trigger set_updated_at before update on public.theory_docs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- theory_checklist_state: per-user checkbox state for interactive checklists
-- rendered inside a theory doc (e.g. the A+ Setup Checklist). item_key is a
-- stable slug of the checklist item text, generated client-side.
-- ---------------------------------------------------------------------------
create table public.theory_checklist_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  theory_doc_id uuid not null references public.theory_docs (id) on delete cascade,
  item_key text not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, theory_doc_id, item_key)
);

create index theory_checklist_state_doc_idx on public.theory_checklist_state (theory_doc_id);

create trigger set_updated_at before update on public.theory_checklist_state
  for each row execute function public.set_updated_at();
