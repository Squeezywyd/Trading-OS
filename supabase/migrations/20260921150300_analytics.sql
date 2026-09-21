-- Analytics: views and RPC functions. Everything here is SECURITY INVOKER
-- (the default for functions, explicit for views) so the caller's RLS on the
-- underlying tables still applies — these never widen access.

-- ---------------------------------------------------------------------------
-- trades_r: trades + derived r_multiple. r_multiple is NEVER stored on the
-- base table, only computed here (pnl_usd / risk_usd).
-- ---------------------------------------------------------------------------
create view public.trades_r
with (security_invoker = true)
as
select
  t.*,
  case
    when t.risk_usd is not null and t.risk_usd <> 0
      then round((t.pnl_usd / t.risk_usd)::numeric, 4)
    else null
  end as r_multiple
from public.trades t;

-- ---------------------------------------------------------------------------
-- equity_curve: one row per day that has at least one trade, running
-- cumulative P&L / R, and drawdown from the running peak.
-- ---------------------------------------------------------------------------
create view public.equity_curve
with (security_invoker = true)
as
with daily as (
  select
    date,
    sum(pnl_usd) as daily_pnl,
    sum(case when risk_usd is not null and risk_usd <> 0 then pnl_usd / risk_usd else 0 end) as daily_r,
    count(*) as trade_count
  from public.trades
  group by date
),
running as (
  select
    date,
    daily_pnl,
    daily_r,
    trade_count,
    sum(daily_pnl) over (order by date) as cumulative_pnl,
    sum(daily_r) over (order by date) as cumulative_r
  from daily
)
select
  date,
  daily_pnl,
  daily_r,
  trade_count,
  cumulative_pnl,
  cumulative_r,
  max(cumulative_pnl) over (order by date rows between unbounded preceding and current row) as running_peak,
  cumulative_pnl - max(cumulative_pnl) over (order by date rows between unbounded preceding and current row) as drawdown
from running
order by date;

-- ---------------------------------------------------------------------------
-- fn_dashboard_kpis: single-row summary for the dashboard, optional date range.
-- ---------------------------------------------------------------------------
create or replace function public.fn_dashboard_kpis(p_start date default null, p_end date default null)
returns table (
  trade_count bigint,
  net_pnl numeric,
  win_rate numeric,
  avg_win_r numeric,
  avg_loss_r numeric,
  expectancy_usd numeric,
  expectancy_r numeric,
  profit_factor numeric,
  max_drawdown numeric,
  rule_break_count bigint,
  current_streak integer,
  current_streak_type text,
  best_win_streak integer,
  best_loss_streak integer
)
language sql
stable
security invoker
as $$
  with scoped as (
    select * from public.trades_r t
    where (p_start is null or t.date >= p_start)
      and (p_end is null or t.date <= p_end)
  ),
  base as (
    select
      count(*) as trade_count,
      coalesce(sum(pnl_usd), 0) as net_pnl,
      round(
        100.0 * count(*) filter (where result = 'Win')
        / nullif(count(*) filter (where result in ('Win', 'Loss')), 0),
      2) as win_rate,
      round(avg(r_multiple) filter (where result = 'Win'), 3) as avg_win_r,
      round(avg(r_multiple) filter (where result = 'Loss'), 3) as avg_loss_r,
      round(avg(pnl_usd), 2) as expectancy_usd,
      round(avg(r_multiple), 3) as expectancy_r,
      round(
        sum(pnl_usd) filter (where pnl_usd > 0)
        / nullif(abs(sum(pnl_usd) filter (where pnl_usd < 0)), 0),
      3) as profit_factor,
      count(*) filter (where followed_plan = false) as rule_break_count
    from scoped
  ),
  dd as (
    select coalesce(min(drawdown), 0) as max_drawdown
    from public.equity_curve ec
    where (p_start is null or ec.date >= p_start)
      and (p_end is null or ec.date <= p_end)
  ),
  ordered as (
    select result, row_number() over (order by date, created_at) as rn
    from scoped
    where result in ('Win', 'Loss')
  ),
  grp as (
    select result, rn, rn - row_number() over (partition by result order by rn) as grp_id
    from ordered
  ),
  streaks as (
    select result, count(*) as len, max(rn) as last_rn
    from grp
    group by result, grp_id
  )
  select
    base.trade_count,
    base.net_pnl,
    base.win_rate,
    base.avg_win_r,
    base.avg_loss_r,
    base.expectancy_usd,
    base.expectancy_r,
    base.profit_factor,
    dd.max_drawdown,
    base.rule_break_count,
    coalesce((select len from streaks order by last_rn desc limit 1), 0) as current_streak,
    (select result::text from streaks order by last_rn desc limit 1) as current_streak_type,
    coalesce((select max(len) from streaks where result = 'Win'), 0) as best_win_streak,
    coalesce((select max(len) from streaks where result = 'Loss'), 0) as best_loss_streak
  from base, dd;
$$;

-- ---------------------------------------------------------------------------
-- fn_bias_accuracy: % of daily preps with a call (excludes No Trade Day),
-- treating Partial as half-credit.
-- ---------------------------------------------------------------------------
create or replace function public.fn_bias_accuracy(p_start date default null, p_end date default null)
returns table (graded_days bigint, accuracy_pct numeric)
language sql
stable
security invoker
as $$
  select
    count(*) filter (where bias_outcome in ('Correct', 'Partial', 'Wrong')) as graded_days,
    round(
      100.0 * (
        count(*) filter (where bias_outcome = 'Correct')
        + 0.5 * count(*) filter (where bias_outcome = 'Partial')
      ) / nullif(count(*) filter (where bias_outcome in ('Correct', 'Partial', 'Wrong')), 0),
    2) as accuracy_pct
  from public.daily_preps
  where (p_start is null or date >= p_start)
    and (p_end is null or date <= p_end);
$$;

-- ---------------------------------------------------------------------------
-- Breakdown functions: one per dimension. Each returns n / win-rate / avg R /
-- expectancy / total P&L, so the UI can flag n < 10 as low-sample.
-- ---------------------------------------------------------------------------
create or replace function public.fn_stats_by_session(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select t.session::text, count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.session order by t.session;
$$;

create or replace function public.fn_stats_by_instrument(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select t.instrument::text, count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.instrument order by t.instrument;
$$;

create or replace function public.fn_stats_by_amd_phase(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select coalesce(t.amd_phase::text, 'Unset'), count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.amd_phase order by t.amd_phase;
$$;

create or replace function public.fn_stats_by_bias_alignment(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select coalesce(t.bias_alignment::text, 'Unset'), count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.bias_alignment order by t.bias_alignment;
$$;

create or replace function public.fn_stats_by_emotion(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select coalesce(t.emotion::text, 'Unset'), count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.emotion order by t.emotion;
$$;

create or replace function public.fn_stats_by_grade(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select coalesce(t.setup_grade::text, 'Unset'), count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.setup_grade order by t.setup_grade;
$$;

create or replace function public.fn_stats_by_weekday(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select trim(to_char(t.date, 'Day')), count(*), count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by extract(dow from t.date), trim(to_char(t.date, 'Day')) order by extract(dow from t.date);
$$;

create or replace function public.fn_stats_by_followed_plan(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select case when t.followed_plan then 'Followed Plan' else 'Did Not Follow Plan' end, count(*),
    count(*) filter (where result = 'Win'), count(*) filter (where result = 'Loss'),
    round(100.0 * count(*) filter (where result = 'Win') / nullif(count(*) filter (where result in ('Win','Loss')), 0), 2),
    round(avg(r_multiple), 3), round(avg(pnl_usd), 2), round(sum(pnl_usd), 2)
  from public.trades_r t
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by t.followed_plan order by t.followed_plan desc;
$$;

-- Multi-select dimensions need unnest: a trade with 2 models counts once per model.
create or replace function public.fn_stats_by_model(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select m.model::text, count(*), count(*) filter (where t.result = 'Win'), count(*) filter (where t.result = 'Loss'),
    round(100.0 * count(*) filter (where t.result = 'Win') / nullif(count(*) filter (where t.result in ('Win','Loss')), 0), 2),
    round(avg(t.r_multiple), 3), round(avg(t.pnl_usd), 2), round(sum(t.pnl_usd), 2)
  from public.trades_r t, unnest(t.models) as m(model)
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by m.model order by m.model;
$$;

create or replace function public.fn_stats_by_mistake(p_start date default null, p_end date default null)
returns table (dimension text, n bigint, wins bigint, losses bigint, win_rate numeric, avg_r numeric, expectancy numeric, total_pnl numeric)
language sql stable security invoker as $$
  select mi.mistake::text, count(*), count(*) filter (where t.result = 'Win'), count(*) filter (where t.result = 'Loss'),
    round(100.0 * count(*) filter (where t.result = 'Win') / nullif(count(*) filter (where t.result in ('Win','Loss')), 0), 2),
    round(avg(t.r_multiple), 3), round(avg(t.pnl_usd), 2), round(sum(t.pnl_usd), 2)
  from public.trades_r t, unnest(t.mistakes) as mi(mistake)
  where (p_start is null or t.date >= p_start) and (p_end is null or t.date <= p_end)
  group by mi.mistake order by mi.mistake;
$$;

-- ---------------------------------------------------------------------------
-- weekly_recap_stats: net P&L / trade count / total R for a week, computed
-- from linked trades — never stored on weekly_recaps itself.
-- ---------------------------------------------------------------------------
create view public.weekly_recap_stats
with (security_invoker = true)
as
select
  wr.id as weekly_recap_id,
  wr.user_id,
  wr.week_start,
  count(t.id) as trade_count,
  coalesce(sum(t.pnl_usd), 0) as net_pnl,
  coalesce(sum(case when t.risk_usd is not null and t.risk_usd <> 0 then t.pnl_usd / t.risk_usd else 0 end), 0) as total_r
from public.weekly_recaps wr
left join public.trades t on t.weekly_recap_id = wr.id
group by wr.id, wr.user_id, wr.week_start;
