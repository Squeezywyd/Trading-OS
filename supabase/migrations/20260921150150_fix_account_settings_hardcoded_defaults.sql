-- account_settings must never ship hardcoded prop-firm or model numbers —
-- the user enters their real LucidFlex 50K values via Settings. This also
-- removes the powell_* columns, which duplicated what model_rules already
-- provides generically for any model.

alter table public.account_settings
  alter column account_name drop default,
  alter column account_name drop not null,
  alter column starting_balance_usd drop default,
  alter column starting_balance_usd drop not null,
  alter column drawdown_type drop default,
  drop column if exists powell_default_contracts,
  drop column if exists powell_stop_min_points,
  drop column if exists powell_stop_max_points;
