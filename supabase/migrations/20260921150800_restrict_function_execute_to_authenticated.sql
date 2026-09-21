-- Analytics RPCs are exposed via PostgREST and default-granted to both `anon`
-- and `authenticated`. This is a single-user private system — anonymous
-- callers must never be able to invoke them (RLS on the underlying tables
-- would return zero rows for anon anyway, but least-privilege says revoke
-- the grant outright rather than rely on that).
revoke execute on function public.fn_dashboard_kpis(date, date) from anon;
revoke execute on function public.fn_bias_accuracy(date, date) from anon;
revoke execute on function public.fn_stats_by_session(date, date) from anon;
revoke execute on function public.fn_stats_by_instrument(date, date) from anon;
revoke execute on function public.fn_stats_by_amd_phase(date, date) from anon;
revoke execute on function public.fn_stats_by_bias_alignment(date, date) from anon;
revoke execute on function public.fn_stats_by_emotion(date, date) from anon;
revoke execute on function public.fn_stats_by_grade(date, date) from anon;
revoke execute on function public.fn_stats_by_weekday(date, date) from anon;
revoke execute on function public.fn_stats_by_followed_plan(date, date) from anon;
revoke execute on function public.fn_stats_by_model(date, date) from anon;
revoke execute on function public.fn_stats_by_mistake(date, date) from anon;
