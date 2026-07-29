-- =====================================================================
-- Narrativas, Personajes y Puzzles: las tablas que faltaban
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- Tres de los cinco modulos del Hub (Narrativas, Puzzles y Personajes)
-- consultaban tablas inexistentes en este proyecto. El archivo
-- supabase/narrativas.sql las creaba, pero era del proyecto anterior y
-- nunca llego a ejecutarse aqui.
--
-- DIFERENCIAS CON AQUEL ARCHIVO
--   1. Las politicas de aquel eran abiertas ("Anyone can..."). Aqui se
--      exige sesion iniciada, como en el resto del proyecto.
--   2. La referencia apunta a labyrinthos, no a la desaparecida cathedrals.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

create table if not exists narrativas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text default 'text' check (type in ('text', 'audio', 'puzzle', 'mixed')),
  labyrinthos_id uuid references labyrinthos(id) on delete set null,
  content jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists personajes (
  id uuid primary key default gen_random_uuid(),
  narrativa_id uuid references narrativas(id) on delete cascade,
  name text not null,
  role text,
  description text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists puzzles (
  id uuid primary key default gen_random_uuid(),
  narrativa_id uuid references narrativas(id) on delete cascade,
  title text not null,
  description text,
  tipo text check (tipo in ('codigo', 'texto', 'audio', 'ubicacion', 'simbolo')),
  respuesta_correcta text,
  pista text,
  created_at timestamptz default now()
);

create index if not exists idx_personajes_narrativa on personajes(narrativa_id);
create index if not exists idx_puzzles_narrativa    on puzzles(narrativa_id);
create index if not exists idx_narrativas_labyrinthos on narrativas(labyrinthos_id);

-- ---------------------------------------------------------------------
-- Seguridad: solo usuarios con sesion iniciada.
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['narrativas', 'personajes', 'puzzles']
  loop
    execute format('alter table %I enable row level security', t);
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on %I', p.policyname, t);
    end loop;
    execute format(
      'create policy auth_all on %I for all to authenticated using (true) with check (true)', t
    );
  end loop;
end $$;

-- Comprobacion: tres tablas, cada una con auth_all y {authenticated}.
select tablename, policyname, roles
from pg_policies
where schemaname = 'public' and tablename in ('narrativas','personajes','puzzles')
order by tablename;
