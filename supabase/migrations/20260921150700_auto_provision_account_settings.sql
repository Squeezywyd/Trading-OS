-- Auto-provision a blank account_settings row for each new auth user so the
-- Settings page can always UPDATE. No numbers are pre-filled.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.account_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger-only function — must never be callable directly as a PostgREST RPC.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
