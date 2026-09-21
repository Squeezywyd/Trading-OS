-- Private "screenshots" bucket. Objects live at {user_id}/{trade_id}/{kind}-{uuid}.{ext}
-- and are served to the client via short-lived signed URLs — never public URLs.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'screenshots',
  'screenshots',
  false,
  10485760, -- 10 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "screenshots_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "screenshots_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "screenshots_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "screenshots_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'screenshots'
  and (storage.foldername(name))[1] = auth.uid()::text
);
