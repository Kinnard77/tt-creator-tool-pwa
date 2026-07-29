-- =====================================================================
-- La maquina elegida para cada umbral
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- Guarda cual de las diez maquinas del Atlas usa cada umbral. Elegirla
-- prerellena la emocion y hace que el validador aplique la regla propia
-- de esa maquina: una Cuenta Regresiva sin restriccion es un error,
-- porque su regla dice que la restriccion temporal es innegociable.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

alter table umbrales add column if not exists maquina text;

alter table umbrales drop constraint if exists umbrales_maquina_valida;
alter table umbrales add constraint umbrales_maquina_valida
  check (maquina is null or maquina in (
    'cuenta_regresiva',      -- 01 Urgencia
    'informacion_oculta',    -- 02 Curiosidad   (grupo)
    'eleccion_irreversible', -- 03 Peso moral
    'recompensa_diferida',   -- 04 Deseo
    'observacion_situada',   -- 05 Presencia
    'prohibicion',           -- 06 Tentacion
    'identidad_asignada',    -- 07 Transformacion (grupo)
    'prueba_confianza',      -- 08 Vulnerabilidad (grupo)
    'meta_puzzle',           -- 09 Revelacion
    'ritual_entrada'         -- 10 Umbral
  ));

create index if not exists idx_umbrales_maquina on umbrales(labyrinthos_id, maquina);

-- Vista de diseno: el estado de cada umbral de un vistazo. Muestra si le
-- faltan componentes de la formula operacional.
create or replace view v_diseno_umbrales as
select
  l.name                              as labyrinthos,
  u.labyrinthos_id,
  u.ciclo,
  u.node_number,
  u.maquina,
  u.emocion,
  u.pacing_value,
  (u.accion_exigida is not null)      as tiene_accion,
  (u.restriccion    is not null)      as tiene_restriccion,
  (u.casi           is not null)      as tiene_casi,
  (u.feedback       is not null)      as tiene_feedback
from umbrales u
join labyrinthos l on l.id = u.labyrinthos_id
order by l.name, u.ciclo, u.node_number;

select table_name, column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'umbrales' and column_name = 'maquina';
