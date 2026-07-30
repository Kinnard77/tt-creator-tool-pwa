-- =====================================================================
-- El arco fijo: sello de presencia y Camara Oscura
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- exige_presencia es el sello Anti-IA. Hereda la regla de la antigua
-- Maquina 05 (Observacion Situada), que deja de ser maquina de etapa y pasa
-- a ser condicion de TODAS: si el enigma se resuelve buscando en Google
-- desde casa, la maquina ha fallado.
--
-- camara_oscura marca el umbral unico que es la Camara Oscura, al final del
-- ciclo 5 y justo antes del Orgullo. Es la muerte del yo, no un cierre de
-- cada ciclo.
--
-- Tambien se actualiza la lista de maquinas: fuera observacion_situada,
-- dentro reconocimiento_grupo (11) y prueba_espejo (12).
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

alter table umbrales add column if not exists exige_presencia boolean default false;
alter table umbrales add column if not exists camara_oscura   boolean default false;

-- Las maquinas de las etapas VII y VIII no viven en ciclos, pero se guardan
-- igual porque el cierre tambien se disena.
alter table umbrales drop constraint if exists umbrales_maquina_valida;
alter table umbrales add constraint umbrales_maquina_valida
  check (maquina is null or maquina in (
    'ritual_entrada',         -- 10 · etapa II  · Deseo
    'recompensa_diferida',    -- 04 · etapa II  · Deseo
    'cuenta_regresiva',       -- 01 · etapa III · Urgencia
    'informacion_oculta',     -- 02 · etapa IV  · Complicidad (grupo)
    'prueba_confianza',       -- 08 · etapa IV  · Complicidad (grupo)
    'prohibicion',            -- 06 · etapa V   · Culpa
    'eleccion_irreversible',  -- 03 · etapa V   · Culpa
    'meta_puzzle',            -- 09 · etapa VI  · Asombro
    'reconocimiento_grupo',   -- 11 · etapa VII · Orgullo (grupo)
    'identidad_asignada',     -- 07 · etapa VIII· Transformacion (grupo)
    'prueba_espejo'           -- 12 · etapa VIII· Transformacion
  ));

-- Observacion Situada ya no es maquina: lo que era se convierte en el sello.
update umbrales
set exige_presencia = true, maquina = null
where maquina = 'observacion_situada';

-- Solo puede haber una Camara Oscura por Labyrinthos.
create unique index if not exists idx_una_camara_oscura
  on umbrales(labyrinthos_id)
  where camara_oscura;

-- Vista de diseno, ampliada.
-- Hay que borrarla antes: "create or replace view" solo permite ANADIR
-- columnas al final, y aqui se insertan dos en medio de las que creo la
-- migracion 08. Sin el drop, Postgres responde 42P16.
drop view if exists v_diseno_umbrales;
create view v_diseno_umbrales as
select
  l.name as labyrinthos, u.labyrinthos_id, u.ciclo, u.node_number,
  u.maquina, u.emocion, u.pacing_value,
  u.exige_presencia, u.camara_oscura,
  (u.accion_exigida is not null) as tiene_accion,
  (u.restriccion    is not null) as tiene_restriccion,
  (u.casi           is not null) as tiene_casi,
  (u.feedback       is not null) as tiene_feedback
from umbrales u
join labyrinthos l on l.id = u.labyrinthos_id
order by l.name, u.ciclo, u.node_number;

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'umbrales'
  and column_name in ('exige_presencia','camara_oscura')
order by column_name;
