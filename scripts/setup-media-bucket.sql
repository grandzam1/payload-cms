insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/*', 'application/pdf'])
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
on storage.objects for select
to public
using (bucket_id = 'media');

drop policy if exists "Anon upload media" on storage.objects;
create policy "Anon upload media"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'media');

drop policy if exists "Anon update media" on storage.objects;
create policy "Anon update media"
on storage.objects for update
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Anon delete media" on storage.objects;
create policy "Anon delete media"
on storage.objects for delete
to anon, authenticated
using (bucket_id = 'media');

select id, name, public from storage.buckets;
