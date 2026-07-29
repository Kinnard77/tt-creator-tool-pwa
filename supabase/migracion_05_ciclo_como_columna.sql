-- =====================================================================
-- El ciclo pasa a ser una columna de verdad
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- POR QUE
-- El ciclo vivia dentro de experience_config, mezclado con el contenido de
-- la experiencia. Eso servia para pintar los colores del mapa, pero:
--   1. No se podia consultar con eficacia ("dame los nodos del ciclo 3"
--      obligaba a rebuscar dentro de un JSON).
--   2. No se podia VALIDAR. Un metapuzzle exige exactamente 4 nodos; si un
--      ciclo se queda con 3, el jugador se atasca y nada te avisa.
--
-- Esta migracion no pierde nada: copia el valor que ya estuviera guardado
-- dentro del JSON. El JSON se mantiene por compatibilidad.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

alter table umbrales add column if not exists ciclo integer;

-- Traer los valores que estaban dentro del JSON.
update umbrales
set ciclo = coalesce(nullif(experience_config->>'ciclo', '')::integer, 1)
where ciclo is null;

alter table umbrales alter column ciclo set default 1;

-- Sin limite superior a proposito: los ciclos crecen segun crezca el
-- proyecto, y la idea es escalar mas alla de las catedrales.
alter table umbrales drop constraint if exists umbrales_ciclo_positivo;
alter table umbrales add constraint umbrales_ciclo_positivo check (ciclo >= 1);

create index if not exists idx_umbrales_ciclo on umbrales(cathedral_id, ciclo);

-- ---------------------------------------------------------------------
-- Vista de validacion: el estado de cada ciclo de un vistazo.
-- Un metapuzzle necesita 4 nodos. Esta vista dice cuales estan completos,
-- a cuales les faltan y cuales tienen de mas.
-- ---------------------------------------------------------------------
create or replace view v_estado_ciclos as
select
  c.name                                as catedral,
  u.cathedral_id,
  u.ciclo,
  count(*)                              as nodos,
  case
    when count(*) = 4 then 'completo'
    when count(*) < 4 then 'faltan ' || (4 - count(*))::text
    else 'sobran ' || (count(*) - 4)::text
  end                                   as estado
from umbrales u
join cathedrals c on c.id = u.cathedral_id
group by c.name, u.cathedral_id, u.ciclo
order by c.name, u.ciclo;

-- Comprobacion: el estado actual de tus ciclos.
select * from v_estado_ciclos;
