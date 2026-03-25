-- UMBRA Creator Tool - Database Schema

-- Tabla de Catedrales
CREATE TABLE IF NOT EXISTS cathedrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  coords JSONB DEFAULT '{"lat": 0, "lng": 0}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'alpha', 'published')),
  umbral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Umbrales (puntos en el espacio)
CREATE TABLE IF NOT EXISTS umbrales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cathedral_id UUID REFERENCES cathedrals(id) ON DELETE CASCADE,
  position JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}',
  trigger_config JSONB NOT NULL DEFAULT '{"type": "geo_radius", "radius": 5}',
  experience_config JSONB NOT NULL DEFAULT '{"type": "text", "content": ""}',
  pacing_value INTEGER DEFAULT 5 CHECK (pacing_value BETWEEN 1 AND 10),
  type TEXT DEFAULT 'umbra' CHECK (type IN ('umbra', 'sigilum')),
  requires JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Desafíos/Puzzles
CREATE TABLE IF NOT EXISTS desafios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  umbral_id UUID REFERENCES umbrales(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'numero', 'reflexion', 'audio', 'foto')),
  pregunta TEXT,
  respuesta_correcta TEXT,
  pista TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE cathedrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE umbrales ENABLE ROW LEVEL SECURITY;
ALTER TABLE desafios ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (para el autor - sin auth por ahora)
CREATE POLICY "Anyone can read cathedrals" ON cathedrals FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cathedrals" ON cathedrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cathedrals" ON cathedrals FOR UPDATE USING (true);

CREATE POLICY "Anyone can read umbrales" ON umbrales FOR SELECT USING (true);
CREATE POLICY "Anyone can insert umbrales" ON umbrales FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update umbrales" ON umbrales FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete umbrales" ON umbrales FOR DELETE USING (true);

CREATE POLICY "Anyone can read desafios" ON desafios FOR SELECT USING (true);
CREATE POLICY "Anyone can insert desafios" ON desafios FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update desafios" ON desafios FOR UPDATE USING (true);

-- Insertar catedrales iniciales
INSERT INTO cathedrals (name, city, country, coords, status, umbral_count) VALUES
('Notre Dame', 'Paris', 'France', '{"lat": 48.853, "lng": 2.3499}', 'draft', 7),
('Catedral de Valencia', 'Valencia', 'Spain', '{"lat": 39.4699, "lng": -0.3763}', 'alpha', 12),
('Catedral de Sevilla', 'Seville', 'Spain', '{"lat": 37.3869, "lng": -5.9928}', 'published', 23),
('Parroquía de Dolores Hidalgo', 'Dolores Hidalgo, Guanajuato', 'México', '{"lat": 21.1583, "lng": -100.9326}', 'draft', 0);