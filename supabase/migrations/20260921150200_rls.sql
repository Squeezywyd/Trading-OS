-- Row Level Security: the security boundary for every table. Each policy is
-- scoped to auth.uid() = user_id. Application/client code must never be
-- relied on to enforce ownership.

alter table public.account_settings enable row level security;
alter table public.model_rules enable row level security;
alter table public.weekly_recaps enable row level security;
alter table public.daily_preps enable row level security;
alter table public.trades enable row level security;
alter table public.trade_screenshots enable row level security;
alter table public.theory_docs enable row level security;
alter table public.theory_checklist_state enable row level security;

-- account_settings ------------------------------------------------------
create policy "account_settings_select_own" on public.account_settings
  for select using (auth.uid() = user_id);
create policy "account_settings_insert_own" on public.account_settings
  for insert with check (auth.uid() = user_id);
create policy "account_settings_update_own" on public.account_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "account_settings_delete_own" on public.account_settings
  for delete using (auth.uid() = user_id);

-- model_rules -------------------------------------------------------------
create policy "model_rules_select_own" on public.model_rules
  for select using (auth.uid() = user_id);
create policy "model_rules_insert_own" on public.model_rules
  for insert with check (auth.uid() = user_id);
create policy "model_rules_update_own" on public.model_rules
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "model_rules_delete_own" on public.model_rules
  for delete using (auth.uid() = user_id);

-- weekly_recaps -------------------------------------------------------------
create policy "weekly_recaps_select_own" on public.weekly_recaps
  for select using (auth.uid() = user_id);
create policy "weekly_recaps_insert_own" on public.weekly_recaps
  for insert with check (auth.uid() = user_id);
create policy "weekly_recaps_update_own" on public.weekly_recaps
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weekly_recaps_delete_own" on public.weekly_recaps
  for delete using (auth.uid() = user_id);

-- daily_preps -------------------------------------------------------------
create policy "daily_preps_select_own" on public.daily_preps
  for select using (auth.uid() = user_id);
create policy "daily_preps_insert_own" on public.daily_preps
  for insert with check (auth.uid() = user_id);
create policy "daily_preps_update_own" on public.daily_preps
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_preps_delete_own" on public.daily_preps
  for delete using (auth.uid() = user_id);

-- trades --------------------------------------------------------------------
create policy "trades_select_own" on public.trades
  for select using (auth.uid() = user_id);
create policy "trades_insert_own" on public.trades
  for insert with check (auth.uid() = user_id);
create policy "trades_update_own" on public.trades
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trades_delete_own" on public.trades
  for delete using (auth.uid() = user_id);

-- trade_screenshots -----------------------------------------------------
create policy "trade_screenshots_select_own" on public.trade_screenshots
  for select using (auth.uid() = user_id);
create policy "trade_screenshots_insert_own" on public.trade_screenshots
  for insert with check (auth.uid() = user_id);
create policy "trade_screenshots_update_own" on public.trade_screenshots
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trade_screenshots_delete_own" on public.trade_screenshots
  for delete using (auth.uid() = user_id);

-- theory_docs: readable by any authenticated user, writable by the owner. --
create policy "theory_docs_select_authenticated" on public.theory_docs
  for select using (auth.role() = 'authenticated');
create policy "theory_docs_insert_own" on public.theory_docs
  for insert with check (auth.uid() = user_id);
create policy "theory_docs_update_own" on public.theory_docs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "theory_docs_delete_own" on public.theory_docs
  for delete using (auth.uid() = user_id);

-- theory_checklist_state ------------------------------------------------
create policy "theory_checklist_state_select_own" on public.theory_checklist_state
  for select using (auth.uid() = user_id);
create policy "theory_checklist_state_insert_own" on public.theory_checklist_state
  for insert with check (auth.uid() = user_id);
create policy "theory_checklist_state_update_own" on public.theory_checklist_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "theory_checklist_state_delete_own" on public.theory_checklist_state
  for delete using (auth.uid() = user_id);

-- Defense in depth: RLS already stops you from *reading* another user's
-- daily_prep/weekly_recap, but without this trigger you could still insert a
-- trade that *references* a row you don't own (the FK alone doesn't check
-- ownership). security definer + fixed search_path so it can see across the
-- RLS boundary just enough to validate, nothing else.
create or replace function public.validate_trade_relations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.daily_prep_id is not null then
    if not exists (
      select 1 from public.daily_preps dp
      where dp.id = new.daily_prep_id and dp.user_id = new.user_id
    ) then
      raise exception 'daily_prep_id does not belong to this user';
    end if;
  end if;

  if new.weekly_recap_id is not null then
    if not exists (
      select 1 from public.weekly_recaps wr
      where wr.id = new.weekly_recap_id and wr.user_id = new.user_id
    ) then
      raise exception 'weekly_recap_id does not belong to this user';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_trades_validate_relations
  before insert or update on public.trades
  for each row execute function public.validate_trade_relations();

create or replace function public.validate_daily_prep_relations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.weekly_recap_id is not null then
    if not exists (
      select 1 from public.weekly_recaps wr
      where wr.id = new.weekly_recap_id and wr.user_id = new.user_id
    ) then
      raise exception 'weekly_recap_id does not belong to this user';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_daily_preps_validate_relations
  before insert or update on public.daily_preps
  for each row execute function public.validate_daily_prep_relations();
