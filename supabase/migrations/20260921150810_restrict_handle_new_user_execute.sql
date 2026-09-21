-- handle_new_user is a SECURITY DEFINER trigger function fired by Supabase
-- Auth on auth.users insert — it must never be callable directly as a
-- PostgREST RPC by anon/authenticated (trigger invocation doesn't need or
-- use these grants).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
