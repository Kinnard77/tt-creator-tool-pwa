-- =====================================================================
-- El esquema definitivo: Labyrinthos + los campos de diseno
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- QUE HACE, EN TRES BLOQUES
--
-- 1. VOCABULARIO. La sede deja de llamarse "cathedral" y pasa a ser
--    Labyrinthos, porque va a haber parques y tramos de ciudad, no solo
--    catedrales. UMBRA es el juego; Umbral sigue siendo el nodo.
--
-- 2. EL LABYRINTHOS GANA TRES CAMPOS. El tipo (interior/exterior/mixto)
--    no es decorativo: decide la mecanica, porque en exterior se puede
--    disparar por radio de GPS y en interior hace falta anclaje calibrado.
--    Y el estado inicial y final del jugador convierten la sede en una
--    promesa medible: llega turista, sale testigo.
--
-- 3. EL UMBRAL GANA CINCO CAMPOS, que son los que faltaban para completar
--    la formula operacional: emocion + accion exigida + informacion
--    incompleta + restriccion significativa + feedback claro. La
--    herramienta solo cubria a medias la informacion incompleta.
--    El "casi" va aparte porque es el motor dopaminergico del juego.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Renombrar la sede
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'cathedrals')
     and not exists (select 1 from information_schema.tables
                     where table_schema = 'public' and table_name = 'labyrinthos')
  then
    alter table cathedrals rename to labyrinthos;
  end if;

  if exists (select 1 from information_schema.columns
             where table_name = 'umbrales' and column_name = 'cathedral_id')
  then
    alter table umbrales rename column cathedral_id to labyrinthos_id;
  end if;

  if exists (select 1 from information_schema.columns
             where table_name = 'data_collection_entries' and column_name = 'cathedral_id')
  then
    alter table data_collection_entries rename column cathedral_id to labyrinthos_id;
  end if;
end $$;


-- ---------------------------------------------------------------------
-- 2. El Labyrinthos: tipo y arco del jugador
-- ---------------------------------------------------------------------
alter table labyrinthos add column if not exists tipo text default 'interior';
alter table labyrinthos drop constraint if exists labyrinthos_tipo_valido;
alter table labyrinthos add constraint labyrinthos_tipo_valido
  check (tipo in ('interior', 'exterior', 'mixto'));

-- Como llega el jugador y como queremos que salga.
-- Ej: 'turista' -> 'testigo'; 'observador pasivo' -> 'investigador'.
alter table labyrinthos add column if not exists estado_inicial text;
alter table labyrinthos add column if not exists estado_final text;


-- ---------------------------------------------------------------------
-- 3. El Umbral: la formula operacional completa
-- ---------------------------------------------------------------------

-- La emocion dominante que persigue este umbral.
alter table umbrales add column if not exists emocion text;
alter table umbrales drop constraint if exists umbrales_emocion_valida;
alter table umbrales add constraint umbrales_emocion_valida
  check (emocion is null or emocion in (
    'misterio', 'deseo', 'urgencia', 'complicidad',
    'culpa', 'asombro', 'orgullo', 'transformacion'
  ));

-- Que tiene que HACER el jugador, no que tiene que responder.
alter table umbrales add column if not exists accion_exigida text;

-- Que le da peso: tiempo, silencio, una prohibicion, el riesgo de perder algo.
alter table umbrales add column if not exists restriccion text;

-- Que responde el sistema: revelacion, desbloqueo, recompensa o consecuencia.
alter table umbrales add column if not exists feedback text;

-- El CASI: la proximidad que acerca sin revelar. Motor dopaminergico
-- central segun project.md, y hasta ahora no tenia donde escribirse.
alter table umbrales add column if not exists casi text;


-- ---------------------------------------------------------------------
-- Indices y vista de validacion, actualizados al nuevo nombre
-- ---------------------------------------------------------------------
drop index if exists idx_umbrales_ciclo;
create index if not exists idx_umbrales_ciclo on umbrales(labyrinthos_id, ciclo);
create index if not exists idx_umbrales_emocion on umbrales(labyrinthos_id, emocion);

drop view if exists v_estado_ciclos;
create or replace view v_estado_ciclos as
select
  l.name                                as labyrinthos,
  u.labyrinthos_id,
  u.ciclo,
  count(*)                              as umbrales,
  case
    when count(*) = 4 then 'completo'
    when count(*) < 4 then 'faltan ' || (4 - count(*))::text
    else 'sobran ' || (count(*) - 4)::text
  end                                   as estado
from umbrales u
join labyrinthos l on l.id = u.labyrinthos_id
group by l.name, u.labyrinthos_id, u.ciclo
order by l.name, u.ciclo;

-- Curva emocional: que emociones cubre cada Labyrinthos y cuales le faltan.
-- Un Labyrinthos sin 'asombro' no tiene climax.
create or replace view v_curva_emocional as
select
  l.name                                          as labyrinthos,
  u.labyrinthos_id,
  u.ciclo,
  u.node_number,
  u.emocion,
  u.pacing_value
from umbrales u
join labyrinthos l on l.id = u.labyrinthos_id
order by l.name, u.ciclo, u.node_number;


-- ---------------------------------------------------------------------
-- Comprobacion
-- ---------------------------------------------------------------------
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'labyrinthos' and column_name in ('tipo','estado_inicial','estado_final')) or
    (table_name = 'umbrales' and column_name in
       ('labyrinthos_id','emocion','accion_exigida','restriccion','feedback','casi'))
  )
order by table_name, column_name;
