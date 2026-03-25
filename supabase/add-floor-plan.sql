-- Agregar campo de plano de planta a cathedrals
ALTER TABLE cathedrals ADD COLUMN IF NOT EXISTS floor_plan_url TEXT;

-- Actualizar coordenadas de Dolores Hidalgo (por si acaso)
UPDATE cathedrals 
SET coords = '{"lat": 21.1583, "lng": -100.9326}' 
WHERE name = 'Parroquía de Dolores Hidalgo';