-- =====================================================================
-- Columnas que el código usa pero que no estaban en el esquema
-- =====================================================================
-- Ejecutar en: supabase.com -> proyecto -> SQL Editor -> New query -> Run
--
-- El Walker guarda cada nodo con un numero correlativo (node_number) y
-- permite asociar un plano de planta a la catedral (floor_plan_url), pero
-- ninguna de las dos columnas existia. Sin ellas, el boton DROP UMBRAL
-- falla al guardar.
--
-- Es seguro ejecutarlo mas de una vez.
-- =====================================================================

alter table umbrales   add column if not exists node_number integer;
alter table cathedrals add column if not exists floor_plan_url text;

-- Numera los nodos que ya existan y aun no tengan numero, respetando el
-- orden en que se crearon.
with numerados as (
  select id,
         row_number() over (partition by cathedral_id order by created_at) as n
  from umbrales
  where node_number is null
)
update umbrales u
set node_number = numerados.n
from numerados
where u.id = numerados.id;

-- Comprobacion: deben aparecer las dos columnas.
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and (
    (table_name = 'umbrales'   and column_name = 'node_number') or
    (table_name = 'cathedrals' and column_name = 'floor_plan_url')
  )
order by table_name;
