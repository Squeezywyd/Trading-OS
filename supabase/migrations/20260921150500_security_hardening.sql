-- Security advisor follow-ups:
-- 1. Pin search_path on every function (mutable search_path is a hijack vector).
-- 2. The two relation-validation triggers are internal only — they must never
--    be callable directly as RPCs by anon/authenticated.

alter function public.set_updated_at() set search_path = public;
alter function public.fn_dashboard_kpis(date, date) set search_path = public;
alter function public.fn_bias_accuracy(date, date) set search_path = public;
alter function public.fn_stats_by_session(date, date) set search_path = public;
alter function public.fn_stats_by_instrument(date, date) set search_path = public;
alter function public.fn_stats_by_amd_phase(date, date) set search_path = public;
alter function public.fn_stats_by_bias_alignment(date, date) set search_path = public;
alter function public.fn_stats_by_emotion(date, date) set search_path = public;
alter function public.fn_stats_by_grade(date, date) set search_path = public;
alter function public.fn_stats_by_weekday(date, date) set search_path = public;
alter function public.fn_stats_by_followed_plan(date, date) set search_path = public;
alter function public.fn_stats_by_model(date, date) set search_path = public;
alter function public.fn_stats_by_mistake(date, date) set search_path = public;

revoke execute on function public.validate_trade_relations() from public, anon, authenticated;
revoke execute on function public.validate_daily_prep_relations() from public, anon, authenticated;
