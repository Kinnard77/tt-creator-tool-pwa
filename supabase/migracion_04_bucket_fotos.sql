-- =====================================================================
-- El bucket de fotos que faltaba
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- El Composer sube las fotos de cada nodo al bucket 'umbrales-fotos', que
-- no existia. De ahi el error "Bucket not found".
--
-- Publico en lectura: las fotos hay que poder verlas desde la app y desde
-- el juego. Escritura y borrado solo para quien haya iniciado sesion.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('umbrales-fotos', 'umbrales-fotos', true)
on conflict (id) do update set public = true;

drop policy if exists uf_lectura_publica on storage.objects;
create policy uf_lectura_publica on storage.objects
  for select to public
  using (bucket_id = 'umbrales-fotos');

drop policy if exists uf_subida on storage.objects;
create policy uf_subida on storage.objects
  for insert to authenticated
  with check (bucket_id = 'umbrales-fotos');

drop policy if exists uf_actualizar on storage.objects;
create policy uf_actualizar on storage.objects
  for update to authenticated
  using (bucket_id = 'umbrales-fotos');

drop policy if exists uf_borrar on storage.objects;
create policy uf_borrar on storage.objects
  for delete to authenticated
  using (bucket_id = 'umbrales-fotos');

-- Comprobacion: debe aparecer el bucket como publico.
select id, name, public from storage.buckets where id = 'umbrales-fotos';
