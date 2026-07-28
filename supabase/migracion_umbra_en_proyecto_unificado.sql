-- =====================================================================
-- UMBRA sobre el proyecto de Supabase unificado
-- =====================================================================
-- Ejecuta este archivo entero en:
--   supabase.com -> tu proyecto -> SQL Editor -> New query -> Run
--
-- QUÉ HACE
--   Crea las tablas de UMBRA (cathedrals, umbrales, desafios) en el MISMO
--   proyecto donde ya viven las tablas ct_* de tt-creator-tool. Los nombres
--   no chocan, así que las dos herramientas conviven sin pisarse.
--
-- DIFERENCIA IMPORTANTE CON EL schema.sql ORIGINAL DE UMBRA
--   El original creaba políticas que permitían a CUALQUIERA leer, escribir
--   y BORRAR ("Anyone can..."). Aquí se exige sesión iniciada, igual que
--   hacen las tablas ct_*. Es la razón por la que UMBRA necesita ahora su
--   pantalla de login.
--
-- Es seguro ejecutarlo más de una vez.
-- =====================================================================

create table if not exists cathedrals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  coords jsonb default '{"lat": 0, "lng": 0}',
  status text default 'draft' check (status in ('draft', 'alpha', 'published')),
  umbral_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists umbrales (
  id uuid primary key default gen_random_uuid(),
  cathedral_id uuid references cathedrals(id) on delete cascade,
  position jsonb not null default '{"lat": 0, "lng": 0}',
  trigger_config jsonb not null default '{"type": "geo_radius", "radius": 5}',
  experience_config jsonb not null default '{"type": "text", "content": ""}',
  pacing_value integer default 5 check (pacing_value between 1 and 10),
  type text default 'umbra' check (type in ('umbra', 'sigilum')),
  requires jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists desafios (
  id uuid primary key default gen_random_uuid(),
  umbral_id uuid references umbrales(id) on delete cascade,
  tipo text not null check (tipo in ('texto', 'numero', 'reflexion', 'audio', 'foto')),
  pregunta text,
  respuesta_correcta text,
  pista text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- Seguridad: solo usuarios con sesión iniciada.
-- Se borran primero las políticas abiertas del esquema antiguo, por si
-- este proyecto llegara a tenerlas.
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['cathedrals', 'umbrales', 'desafios']
  loop
    execute format('alter table %I enable row level security', t);

    -- Fuera cualquier política previa de esta tabla.
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on %I', p.policyname, t);
    end loop;

    execute format(
      'create policy auth_all on %I for all to authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Comprobación: debe listar las tres tablas, cada una con la política
-- auth_all y el rol {authenticated}.
-- ---------------------------------------------------------------------
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('cathedrals', 'umbrales', 'desafios')
order by tablename;
