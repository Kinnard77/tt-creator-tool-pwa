-- Crear 4 nodos de ejemplo para Notre Dame (arreglado)
INSERT INTO umbrales (cathedral_id, position, trigger_config, experience_config, pacing_value, type) 
SELECT 
  (SELECT id FROM cathedrals WHERE name LIKE '%Notre Dame%' LIMIT 1),
  '{"lat": 48.8530, "lng": 2.3495}'::jsonb, 
  '{"type": "geo_radius", "radius": 10}'::jsonb,
  '{"sigilum": {"puzzle": "¿Cuántos arcos tiene el pórtico norte?", "answer": "7", "hint": "Cuenta los arcos apuntados"}}'::jsonb,
  5, 'umbra'
UNION ALL
SELECT 
  (SELECT id FROM cathedrals WHERE name LIKE '%Notre Dame%' LIMIT 1),
  '{"lat": 48.8535, "lng": 2.3500}'::jsonb,
  '{"type": "geo_radius", "radius": 10}'::jsonb,
  '{"sigilum": {"puzzle": "Busca una letra cerca del altar. ¿Cuál?", "answer": "F", "hint": "Lado izquierdo del altar"}}'::jsonb,
  6, 'umbra'
UNION ALL
SELECT 
  (SELECT id FROM cathedrals WHERE name LIKE '%Notre Dame%' LIMIT 1),
  '{"lat": 48.8540, "lng": 2.3490}'::jsonb,
  '{"type": "geo_radius", "radius": 10}'::jsonb,
  '{"sigilum": {"puzzle": "Distancia del banco al pilar en metros", "answer": "3", "hint": "1 paso ≈ 1 metro"}}'::jsonb,
  5, 'umbra'
UNION ALL
SELECT 
  (SELECT id FROM cathedrals WHERE name LIKE '%Notre Dame%' LIMIT 1),
  '{"lat": 48.8545, "lng": 2.3485}'::jsonb,
  '{"type": "geo_radius", "radius": 15}'::jsonb,
  '{"sigilum": {"puzzle": "Código final: F + 7 + 3", "answer": "F73", "hint": "Letra + arcos + distancia"}}'::jsonb,
  8, 'umbra';

-- Ver los nodos creados
SELECT u.id, u.position, u.experience_config->'sigilum'->>'puzzle' as puzzle
FROM umbrales u
JOIN cathedrals c ON u.cathedral_id = c.id
WHERE c.name LIKE '%Notre Dame%';