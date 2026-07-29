-- =====================================================================
-- Data Collection Box: la tabla que faltaba
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- La pantalla existe en el codigo (app/composer/[id]/data) y se llega a
-- ella desde cada nodo del Composer, pero la tabla que necesita no estaba
-- en ninguna migracion. Sin esto, la pantalla abre vacia y da error al
-- guardar.
--
-- El campo type_specific es un JSON libre: cada uno de los 15 tipos de
-- dato (fisicos, historicos, esotericos, geometria sagrada, numerologia,
-- simbolismo, astronomia, acustica, materiales, textos, arte, arquitectura,
-- leyendas, ficcion, personajes) guarda ahi sus propios campos.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

create table if not exists data_collection_entries (
  id uuid primary key default gen_random_uuid(),
  cathedral_id uuid references cathedrals(id) on delete cascade,
  umbral_id uuid references umbrales(id) on delete cascade,
  type text not null,
  title text not null,
  content text,
  type_specific jsonb default '{}',
  status text default 'draft',
  created_at timestamptz default now()
);

create index if not exists idx_dce_umbral    on data_collection_entries(umbral_id);
create index if not exists idx_dce_cathedral on data_collection_entries(cathedral_id);

-- Seguridad: solo usuarios con sesion iniciada, igual que el resto.
alter table data_collection_entries enable row level security;

do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'data_collection_entries'
  loop
    execute format('drop policy if exists %I on data_collection_entries', p.policyname);
  end loop;

  execute 'create policy auth_all on data_collection_entries for all to authenticated using (true) with check (true)';
end $$;

-- Comprobacion.
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public' and tablename = 'data_collection_entries';
