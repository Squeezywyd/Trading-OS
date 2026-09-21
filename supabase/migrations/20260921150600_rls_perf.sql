-- Perf advisor: auth.uid() in a RLS USING/CHECK clause gets re-evaluated per
-- row. Wrapping it as (select auth.uid()) lets Postgres evaluate it once per
-- query (it becomes an InitPlan) instead. Same security semantics, faster at
-- scale. See https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

alter policy "account_settings_select_own" on public.account_settings
  using ((select auth.uid()) = user_id);
alter policy "account_settings_insert_own" on public.account_settings
  with check ((select auth.uid()) = user_id);
alter policy "account_settings_update_own" on public.account_settings
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "account_settings_delete_own" on public.account_settings
  using ((select auth.uid()) = user_id);

alter policy "model_rules_select_own" on public.model_rules
  using ((select auth.uid()) = user_id);
alter policy "model_rules_insert_own" on public.model_rules
  with check ((select auth.uid()) = user_id);
alter policy "model_rules_update_own" on public.model_rules
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "model_rules_delete_own" on public.model_rules
  using ((select auth.uid()) = user_id);

alter policy "weekly_recaps_select_own" on public.weekly_recaps
  using ((select auth.uid()) = user_id);
alter policy "weekly_recaps_insert_own" on public.weekly_recaps
  with check ((select auth.uid()) = user_id);
alter policy "weekly_recaps_update_own" on public.weekly_recaps
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "weekly_recaps_delete_own" on public.weekly_recaps
  using ((select auth.uid()) = user_id);

alter policy "daily_preps_select_own" on public.daily_preps
  using ((select auth.uid()) = user_id);
alter policy "daily_preps_insert_own" on public.daily_preps
  with check ((select auth.uid()) = user_id);
alter policy "daily_preps_update_own" on public.daily_preps
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "daily_preps_delete_own" on public.daily_preps
  using ((select auth.uid()) = user_id);

alter policy "trades_select_own" on public.trades
  using ((select auth.uid()) = user_id);
alter policy "trades_insert_own" on public.trades
  with check ((select auth.uid()) = user_id);
alter policy "trades_update_own" on public.trades
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "trades_delete_own" on public.trades
  using ((select auth.uid()) = user_id);

alter policy "trade_screenshots_select_own" on public.trade_screenshots
  using ((select auth.uid()) = user_id);
alter policy "trade_screenshots_insert_own" on public.trade_screenshots
  with check ((select auth.uid()) = user_id);
alter policy "trade_screenshots_update_own" on public.trade_screenshots
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "trade_screenshots_delete_own" on public.trade_screenshots
  using ((select auth.uid()) = user_id);

alter policy "theory_docs_select_authenticated" on public.theory_docs
  using ((select auth.role()) = 'authenticated');
alter policy "theory_docs_insert_own" on public.theory_docs
  with check ((select auth.uid()) = user_id);
alter policy "theory_docs_update_own" on public.theory_docs
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "theory_docs_delete_own" on public.theory_docs
  using ((select auth.uid()) = user_id);

alter policy "theory_checklist_state_select_own" on public.theory_checklist_state
  using ((select auth.uid()) = user_id);
alter policy "theory_checklist_state_insert_own" on public.theory_checklist_state
  with check ((select auth.uid()) = user_id);
alter policy "theory_checklist_state_update_own" on public.theory_checklist_state
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "theory_checklist_state_delete_own" on public.theory_checklist_state
  using ((select auth.uid()) = user_id);

-- Storage policies (created with `to authenticated`, not owned by a plain
-- user_id column) also re-evaluate auth.uid() per row; fix the same way.
alter policy "screenshots_select_own" on storage.objects
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = (select auth.uid())::text);
alter policy "screenshots_insert_own" on storage.objects
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = (select auth.uid())::text);
alter policy "screenshots_update_own" on storage.objects
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'screenshots' and (storage.foldername(name))[1] = (select auth.uid())::text);
alter policy "screenshots_delete_own" on storage.objects
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Unindexed FKs flagged by the advisor.
create index if not exists theory_docs_user_id_idx on public.theory_docs (user_id);
create index if not exists trade_screenshots_user_id_idx on public.trade_screenshots (user_id);
