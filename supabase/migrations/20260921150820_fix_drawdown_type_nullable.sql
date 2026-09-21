-- Bug: the hardcoded-defaults cleanup dropped the DEFAULT on drawdown_type
-- but left it NOT NULL, so handle_new_user's bare
-- `insert into account_settings (user_id) values (...)` would fail on every
-- new signup with a not-null violation. account_settings otherwise leaves
-- every prop-firm field null until the user fills in Settings — drawdown_type
-- should follow the same rule rather than being the one column forced to
-- have a value before the user has entered anything.
alter table public.account_settings
  alter column drawdown_type drop not null;
